import { Request, Response } from "express";
import { forEach, identity } from "lodash";
import { Types } from "mongoose";
import Payment from "../models/Payment";
import User from "../models/User";
import PaymentService from "../services/PaymentService";
import Cron from '../services/Cron';
import request from "request";
var braintree = require("braintree");

export default class PaymentController {
  static async createPayment(req: Request, res: Response) {
    PaymentService.create(req)
      .then((payment) => {
        res.json({ error: false, status: 200, url: payment.url });
        Payment.create(payment);
      })
      .catch((e) => {
        console.log(e);
        return res.json({
          error: true,
          status: 500,
          message: "An error occured.",
        });
      });
  }

  static async storeVault(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    let token = req.body.token,
      name = req.body.name;
    let { email, company, user_id } = req.body;
    console.log('------------------>' + JSON.stringify(req.body));
    try {
      // await User.find({ _id: Types.ObjectId(user_id) ,payment_id:{ $in: data }}).count();

      await gateway.paymentMethod
        .create({
          // firstName: name,
          //company: company,
          // email: email,
          customerId: req.body.user_id,
          paymentMethodNonce: token,
        })
        .then(async (result, err) => {
          console.log('======' + JSON.stringify(result));
          if (result['success']) {
            let cardDetails = {
              cardName: result.paymentMethod.cardholderName,
              // cardTransactionId: result.customer.id,
              token: result.paymentMethod.token,
              globalId: result.paymentMethod.globalId,
              graphQLId: result.paymentMethod.graphQLId,
              cardType: result.paymentMethod.cardType,
              expirationMonth: result.paymentMethod.expirationMonth,
              expirationYear: result.paymentMethod.expirationYear,
              uniqueNumberIdentifier: result.paymentMethod.uniqueNumberIdentifier,
              maskedNumber: result.paymentMethod.maskedNumber,
              imageUrl: result.paymentMethod.imageUrl
            }
  
            let data = result.paymentMethod.maskedNumber;
            let flag = await User.find({
              _id: Types.ObjectId(user_id),
              payment_id: { $in: [data] },
            }).count();
  
            if (flag == 0) {
              let user: any = await User.findOne(
                { _id: Types.ObjectId(user_id) },
                { payment_id: 1 }
              );
              let data1 = JSON.parse(JSON.stringify(user));
              const payment_id: Array<String> | undefined = data1.payment_id;
  
              if (payment_id && payment_id.length === 0) {
                console.log('3333333333333');
                await User.updateOne(
                  { _id: user_id },
                  { $set: { primary_card: cardDetails } }
                );
              }
  
            }
            console.log(flag);
            if (flag == 0) {
              console.log('44444444444');
              await User.updateOne(
                { _id: Types.ObjectId(user_id) },
                { $push: { payment_id: cardDetails } }
              );
            }
          }
          else if (!result['success']) {
            return res.send({
              error: true,
              message: result['message']
            }); 
          }
        })
        .catch((err) => {
          console.log(err);
          console.log('11111111111111');
          return res.send({
            error: true,
            message: "Invalid Credit Card Information",
          });
        });
    } catch (err) {
      console.log(err);
      console.log('wwwwwwwwwwwwww');
      return res.send({
        error: true,
        message: "Invalid Credit Card Information",
      });
    }

    return res.json({ success: true });
  }

  static async paymentInfo(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    let { user_id } = req.body;
    console.log("=" + user_id);

    try {
      let user: any = await User.findOne(
        { _id: Types.ObjectId(user_id) },
        { payment_id: 1 },

      );
      let user2: any = await User.findOne(
        { _id: Types.ObjectId(user_id) },
        { primary_card: 1 },

      );



      console.log(typeof user);
      let data = JSON.parse(JSON.stringify(user));
      let data2 = JSON.parse(JSON.stringify(user2));
      let payment_id: Array<String> | undefined = data.payment_id;
      const primary: string = data2.primary_card;
      let cards = [];

      //  const idx=payment_id.indexOf(primary);

      if (primary !== undefined)
        payment_id = payment_id.filter(val => val !== primary)
      //  if(primary!==undefined)
      cards = payment_id.slice(-2);

      if (primary !== undefined)
        cards.push(primary);
      console.log(cards);


      // for (let i = 0; i < payment_id.length; i++) {
      //   let customer = await gateway.customer.find(payment_id[i]);

      //   cards.push(customer.creditCards[0].maskedNumber);

      //   console.log(cards);
      // }

      res.json({ success: true, data: { card: cards } });
    } catch (error) {
      console.log(error);
    }
    // res.json({ success: true });
  }

  static paymentSuccess(req: Request, res: Response) {
    const { paymentId, token, PayerID } = req.query;

    Payment.findOneAndUpdate(
      { payment_id: paymentId, token },
      {
        $set: {
          completed: true,
          payer_id: PayerID,
        },
      },
      (err, result) => {
        if (err)
          return res.json({
            error: true,
            status: 500,
            message: "An error occured.",
          });

        res.json({ error: false, status: 200, message: "Payment Success" });
      }
    );
  }

  static paymentFail(req: Request, res: Response) {
    console.log(req.query);
    return res.json({ error: true, status: 500, message: "An error occured." });
  }

  static async getTeam(req: Request, res: Response) {
    let { hirer_id } = req.body;
    let value: Array<Object> = [];
    console.log(hirer_id);
    let candidates = await User.find({
      "hiring_status.hirer_id": Types.ObjectId(hirer_id),
    });
    let total_salary = 0;
    let total_count = 0;
    candidates.forEach((candidate: any, index) => {
      let obj = {
        _id: candidate._id,
        s_no: index + 1,
        name: candidate.name,
        Employee_id: candidate.id,
        Position: candidate.designation,
        Salary: candidate.expected_salary,
      };
      total_salary = total_salary + candidate.salary.value;
      value.push(obj);
    });
    console.log(value);
    res.send({
      status: true,
      data: {
        total_salary: total_salary,
        candidate: value,
      },
    });
  }

  static async getCard(req: Request, res: Response) {
    let { user_id } = req.body;
    let responseData;
    let user: any = await User.findOne(
      { _id: Types.ObjectId(user_id) },
      { primary_card: 1 })
      console.log('card list one: ', user);
    let data = JSON.parse(JSON.stringify(user));
    if (!data.primary_card) {
      let cardList = await User.findOne(
        { _id: Types.ObjectId(user_id) },
        { payment_id: 1 });
      console.log('card list: ', cardList);
      responseData = cardList['payment_id'][0];
    }
    else if (data.primary_card) {
      responseData = data.primary_card;
    }
    
    res.json({
      success: true,
      data: {
        primary_card: responseData,
      }
    })

  }

  static async getCardById(req: Request, res: Response) {
    // let { user_id, card_no } = req.body;
    let card_no = req.params.id
    let data = await User.aggregate(
      [
        {
          $match: {
            "payment_id.token": card_no
          }
        },
        { $unwind: "$payment_id" },
        {
          $match: {
            "payment_id.token": card_no
          }
        },
        { $project: { payment_id: 1 } }
      ]
    )
    res.json({
      success: true,
      data: {
        card: data,
      }
    })



  }


  static async updateCard(req: Request, res: Response) {
    let { user_id } = req.body;
    let card_no = req.params.id;
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    let data = await User.aggregate(
      [
        {
          $match: {
            "_id": Types.ObjectId(user_id)
          }
        },
        {
          $match: {
            "payment_id.token": card_no
          }
        },
        { $project: { payment_id: 1, primary_card: 1 } }
      ]


    )

    let index = data[0].payment_id.findIndex(card => card.token == card_no)
    data[0].payment_id[index].cardName = req.body.cardName
    data[0].payment_id[index].expirationMonth = req.body.expirationMonth
    data[0].payment_id[index].expirationYear = req.body.expirationYear
    data[0].payment_id[index].cvv = req.body.cvv

    if (data[0].primary_card.token == card_no) {
      data[0].primary_card.cardName = req.body.cardName
      data[0].primary_card.expirationMonth = req.body.expirationMonth
      data[0].primary_card.expirationYear = req.body.expirationYear
      data[0].primary_card.cvv = req.body.cvv

    }
    let response = gateway.creditCard.update(card_no, {
      cardholderName: req.body.cardName,
      // number: '4111111111111111',
      expirationDate: req.body.expirationMonth + '/' + req.body.expirationYear,
      cvv: req.body.cvv,
      // billingAddress: {
      //   region: 'IL'
      // },
      // options: {
      //   verifyCard: true
      // }
    }, async (err, result) => {
      await User.updateOne({ _id: user_id }, { $set: { primary_card: data[0].primary_card, payment_id: data[0].payment_id } })
    });

    res.json({
      success: true,
      data: {
        card: response,
      }
    })
  }

  static async getTransaction(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });

    let { user_id, email, pagination } = req.body;

    let tran = [],
      candidate = {};

    try {
      let user: any = await User.findOne(
        { _id: Types.ObjectId(user_id) },
        { payment_id: 1 }
      );

      const stream = await gateway.transaction.search((search) => {
        search.customerId().is(user_id);
      });

      stream.on("data", (transaction) => {
        // console.log(
        //   transaction,'.........................'
        // );
        let obj = {
          // status: transaction.status,
          amount: transaction.amount,
          time: transaction.createdAt,
          card_no: transaction.creditCard.maskedNumber,
          id: transaction.id,
          status: transaction.processorResponseText
        };
        tran.push(obj);
      });
      stream.on("end", () => {
        console.log(tran);
        if (pagination != false) {
          tran = tran.slice(0, 10)
        }
        res.json({
          success: true,
          data: { candidate: candidate, transaction: tran },
        });

      });


    }
    catch (err) {
      console.log(err);
    }

    //  res.json({success:true,data:{candidate:candidate,transaction:tran.slice(0,10)}});
  }
  static async removeCards(req: Request, res: Response) {
    let { user_id } = req.body;
    try {

      let cardsData = await User.findOne({ _id: Types.ObjectId(user_id), payment_id: { $exists: true } }, { payment_id: 1 })
      let primaryCard = await User.findOne({ _id: Types.ObjectId(user_id), primary_card: { $exists: true } }, { primary_card: 1 })
      console.log('cards data', cardsData, primaryCard);
      
      if (cardsData && primaryCard) {
        let cardsDataCopied = JSON.parse(JSON.stringify(cardsData));
        let primaryCardCopied = JSON.parse(JSON.stringify(primaryCard));
        let index = cardsDataCopied['payment_id'].findIndex(card => card.uniqueNumberIdentifier == primaryCardCopied['primary_card'].uniqueNumberIdentifier)
        cardsDataCopied['payment_id'].splice(index, 1)
        primaryCardCopied['primary_card'].primary = true
        let responseData = primaryCard ? [...[primaryCardCopied['primary_card']], ...cardsDataCopied['payment_id']] : [...cardsDataCopied['payment_id']];
        res.json({
          status: true,
          data: {
            card: responseData,
          },
        });
      }
      
      let responseData = [...cardsData['payment_id']]

      res.json({
        status: true,
        data: {
          card: responseData,
        },
      });
    } catch (error) {
      res.json({ status: false, error });
    }
  }
  static async deleteCard(req: Request, res: Response) {
    console.log('-------------->' + JSON.stringify(req.body));
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    let { user_id, card_token } = req.body;
    let result = await gateway.creditCard.delete(card_token, async (err) => {
      console.log('card_token', card_token);
      
      await User.findOneAndUpdate({ _id: Types.ObjectId(user_id) }, { "$pull": { "payment_id": { "token": card_token } } })
      res.json({ status: true, result });
    });
    
  }

  static async makePrimary(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    let { user_id, card_token } = req.body;
    let data;
    let result = await gateway.customer.update(user_id, {
      defaultPaymentMethodToken: card_token,
    }).then(async res => {
      console.log('primary result', res);

      data = await User.aggregate(
        [
          {
            $match: {
              "payment_id.token": card_token
            }
          },
          { $unwind: "$payment_id" },
          {
            $match: {
              "payment_id.token": card_token
            }
          },
          { $project: { payment_id: 1 } }
        ]
      )
    });

    await User.updateOne({ _id: user_id }, { $set: { primary_card: data[0].payment_id } })

    res.json({ status: true, result });
  }

  static async savedCardTransaction(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    let start = "378282";
    let card = "0005";
    let firstName, company, email, token;
    const stream = await gateway.customer.search(
      (search) => {
        search.creditCardNumber().startsWith(start);
        search.creditCardNumber().endsWith(card);
      },
      (err, response) => {
        response.each(async (err, customer) => {
          await console.log(customer);
          token = customer.creditCards[0].token;
          firstName = customer.firstName;
          email = customer.email;
          //company = customer.company;
        });
      }
    );
    await gateway.customer
      .create({
        firstName: name,
        // company: company,
        email: email,
        paymentMethodNonce: token,
      })
      .then((result) => {
        console.log(result);
      });
    res.send(200);
  }

  static async CreateCustomer(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    try {
      await gateway.customer
        .create(req.body)
        .then(async (result, err) => {
          // console.log('called create customer', result);
          let user = (await User.updateOne({ _id: Types.ObjectId(req.body.id) }, { $set: { customerId: req.body.id } }));
          if (err)
            return res.send({ error: true, message: err })
          else if (result)
            return res.send({ success: true, message: user })
        })
    } catch (err) {
      return res.send({
        error: true,
        message: "Invalid Credit Card Information",
      });
    }
  }

  static async AddAddress(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    try {
      await gateway.address
        .create(req.body)
        .then(async (result, err) => {
          if (err)
            return res.send({ error: true, message: err })
          else if (result)
            return res.send({ success: true })
        })
    } catch (err) {
      return res.send({
        error: true,
        message: "Invalid Credit Card Information",
      });
    }
  }

  static async UpdateAddress(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    try {
      await gateway.address
        .update(req.body.customerId, req.body.addressId, req.body.payload)
        .then(async (result, err) => {
          if (err)
            return res.send({ error: true, message: err })
          else if (result)
            return res.send({ success: true })
        })
    } catch (err) {
      return res.send({
        error: true,
        message: "Invalid Credit Card Information",
      });
    }
  }

  static async UpdateCustomer(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    try {
      await gateway.address
        .create(req.body.id, req.body)
        .then(async (result, err) => {
          if (err)
            return res.send({ error: true, message: err })
          else if (result)
            return res.send({ success: true })
        })
    } catch (err) {
      return res.send({
        error: true,
        message: "Invalid Credit Card Information",
      });
    }
  }

  static async SearchCustomer(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    try {
      await gateway.customer.search((search) => {
        search.id().is(req.body.id);
      }, (err, response) => {
        response.each((err, customer) => {
          console.log(customer.firstName);
          return res.send({ success: true, customer })
        });
      });
    } catch (err) {
      return res.send({
        error: true,
        message: "Invalid Credit Card Information",
      });
    }
  }

  static async CheckCustomerAddress(req: Request, res: Response) {
    let gateway = await braintree.connect({
      environment: braintree.Environment.Production,
      merchantId: "z28jcfpqjy2yckvh",
      publicKey: "9yjbnvzz6xfcskys",
      privateKey: "87e271a199fe228c049873062dfebdad",
    });
    try {
      await gateway.customer.search((search) => {
        search.id().is(req.params.id);
      }, (err, response) => {
        response.each((err, customer) => {
          console.log('err', err);

          if (customer) {
            if (customer && customer.addresses && customer.addresses.length > .0)
              return res.send({ success: true })
            else
              return res.send({ success: false })
          }
          else
            return res.send({ success: false })
        });
      });
    } catch (err) {
      return res.send({
        error: true,
        message: "Invalid Credit Card Information",
      });
    }
  }
}
