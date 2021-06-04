import * as _ from "lodash";


export default class AdminDataService  {
count;
static processdata(data1 , data2 ) {
  const data = _.unionWith(data1, data2, _.isEqual);
  let processedData=[] ;
  data.map((value)=>{
    value.skills.map((data) =>{
      data.data.map((value)=>{
        if(!value._id){
          processedData.push({title: value.title })
        }
      })
    })
 })
processedData =  _.map(_.groupBy(processedData, 'title'), (data, title) => {
  return {title :title , count: data.length} 
  })
return processedData;
}


}