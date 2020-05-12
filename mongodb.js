const {MongoClient , ObjectID} = require('mongodb')


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'Task-manager'




MongoClient.connect(connectionURL , {useNewUrlParser:true} , (error , client)=>{
    if (error){
        return console.log('Unable to connect!')
    }

    const db = client.db(databaseName)
//     db.collection('users').insertOne({
//         name : 'reda',

//     },(error,res)=>{
//         if (error){
//             return console.log('unable to insert')
//         }
//         console.log(res.ops)
//     })

    // db.collection('users').findOne({_id:new ObjectID('5ea248b440519816e84c2159')}, (error, user)=>{
    //     if (error){return console.log('can not find')}
    //     console.log(user)
    // })

//    db.collection('tasks').updateMany({
//        completed : 'true'
//    },{
//        $set :{
//            completed : 'True'
//        }
//    }).then((result)=>{
//        console.log(result.modifiedCount)
//    }).catch((error)=>{
//        console.log('error')
//    })

    // db.collection('users').updateOne({name:'reda'} , {$set :{Age:24}}).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

        db.collection('users').deleteOne({Age:20}).then((result)=>{
            console.log(result)
        }).catch((error)=>{
            console.log(error)
        })



})
