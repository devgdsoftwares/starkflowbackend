import * as url from 'url';
import * as paypal from 'paypal-rest-sdk';
import { Types } from "mongoose";

paypal.configure({
    mode: process.env.MODE, //sandbox or live 
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
});

export default class PaymentService {
    static async create(req) {
        const receipt = PaymentService.createReceipt();

        return new Promise( ( resolve , reject ) => {
            paypal.payment.create( receipt , function( err , transaction ) {
                if ( err ) {
                    reject(err); 
                }
                else {
                    const { links, id } = transaction;
                    let counter = links.length; 
                    while( counter -- ) {
                        if ( links[counter].method == 'REDIRECT') {
                            
                            resolve({
                                payment_id: id,
                                token: url.parse(links[counter].href, true).query.token,
                                user_id: req.user._id,
                                company_id: Types.ObjectId(req.query.id),
                                url:links[counter].href
                            });
                        }
                    } 
                }
            }); 
        });
        
    }

    private static createReceipt() {
        return {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.BASE_URL}payment/success`,
                "cancel_url": `${process.env.BASE_URL}payment/error`
            },
            "transactions": [{
                "amount": {
                    "total": 0.25,
                    "currency": "USD"
                },
                "description": " a book on mean stack "
            }]
        }
    }
}