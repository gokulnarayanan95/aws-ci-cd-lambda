var aws = require('aws-sdk');
var ses = new aws.SES({
   region: 'us-east-1'
});
// Chec007_TESTINg
var uuid = require('uuid'),
documentClient = new aws.DynamoDB.DocumentClient(); 
// Sassasalloopopasnakn
exports.handler = function(event, context,callback) {
    console.log("Incoming: ", event);
   // var output = querystring.parse(event);

     /*()()()()() */
	
    var getparams = {
        TableName : process.env.TableName,
        KeyConditionExpression: "#email = :value",
        ExpressionAttributeNames:{
            "#email": "Email"
        },
        ExpressionAttributeValues: {
            ":value": event.Records[0].Sns.Message
        }
     };

        //test commit
        // Call DynamoDB to read the item from the table
    documentClient.query(getparams, function(err, data){

        if (err) {
            console.log("Error", err);
        } else {
            if(data.Items.length !=0){
                //data present
                var currentTime=new Date()
                console.log(data.Items[0])
                var ttldate=new Date(data.Items[0].TTL*1000)
                var minutes = "0" + ttldate.getMinutes();
                console.log(ttldate)
                var diff=ttldate.getMinutes() - currentTime.getMinutes()
                if(diff < 0){
                    //expired
                    console.log("expired")
                    var uuidval=uuid.v1()
                    var twentyMinutesLater = new Date();
                    var date=Math.floor(twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 20)/1000);
                    var params = {
            		Item : {
            			"id" : uuidval,
            			"Email" : event.Records[0].Sns.Message,
            			"url"  : "https://csye6225-fall2018-"+process.env.DomainUser+".me/reset?email="+event.Records[0].Sns.Message+"&token="+uuidval,
            			"TTL"  : date
            		},
            		TableName : process.env.TableName
                	};
                	documentClient.put(params, function(err, data){
                		    callback(err, data);
                		    var SnsMessage = event.Records[0].Sns.Message;
                            var url = event.Records[0].Sns.Subject;
                            console.log(event.Records[0].Sns.Subject);
                            console.log(event.Records[0].Sns.Message);
                            var eParams = {
                                Destination: {
                                    ToAddresses: [event.Records[0].Sns.Message]
                                },
                                Message: {
                                    Body: {
                                        Text: {
                                            Data: params.Item.url
                                        }
                                    },
                                    Subject: {
                                        Data: "Password Reset!!!"
                                    }
                                },
                                Source: "password_reset@csye6225-fall2018-"+process.env.DomainUser+".me"
                            };
                        
                            console.log('===SENDING EMAIL===');
                            var email = ses.sendEmail(eParams, function(err, data){
                                if(err) console.log(err);
                                else {
                                    console.log("===EMAIL SENT===");
                                    console.log(data);
                        
                        
                                    console.log("EMAIL CODE END");
                                    console.log('EMAIL: ', email);
                                    context.succeed(event);
                        
                                }
                            });
                	});
                	
                }
                else{
                    console.log("not expired")
                   /* var SnsMessage = event.Records[0].Sns.Message;
                    var url = event.Records[0].Sns.Subject;
                    console.log(event.Records[0].Sns.Subject);
                    console.log(event.Records[0].Sns.Message);
                    var eParams = {
                        Destination: {
                            ToAddresses: [event.Records[0].Sns.Message]
                        },
                        Message: {
                            Body: {
                                Text: {
                                    Data: data.Items[0].url
                                }
                            },
                            Subject: {
                                Data: "Password Reset!!!"
                            }
                        },
                        Source: "password_reset@csye6225-fall2018-"+process.env.DomainUser+".me"
                    };
                
                    console.log('===SENDING EMAIL===');
                    var email = ses.sendEmail(eParams, function(err, data){
                        if(err) console.log(err);
                        else {
                            console.log("===EMAIL SENT===");
                            console.log(data);
                
                
                            console.log("EMAIL CODE END");
                            console.log('EMAIL: ', email);
                            context.succeed(event);
                
                        }
                    }); */
                }
            }
            else {
                //data not present
                var uuidval=uuid.v1() 
                var twentyMinutesLater = new Date();
                var date=Math.floor(twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 20)/1000);
                var params = {
        		Item : {
        			"id" : uuidval,
        			"Email" : event.Records[0].Sns.Message,
        			"url"  : "https://csye6225-fall2018-"+process.env.DomainUser+".me/reset?email="+event.Records[0].Sns.Message+"&token="+uuidval,
        			"TTL"  : date
        		},
        		TableName : process.env.TableName
            	};
            	documentClient.put(params, function(err, data){
            		callback(err, data);
            		var SnsMessage = event.Records[0].Sns.Message;
                            var url = event.Records[0].Sns.Subject;
                            console.log(event.Records[0].Sns.Subject);
                            console.log(event.Records[0].Sns.Message);
                            var eParams = {
                                Destination: {
                                    ToAddresses: [event.Records[0].Sns.Message]
                                },
                                Message: {
                                    Body: {
                                        Text: {
                                            Data: params.Item.url
                                        }
                                    },
                                    Subject: {
                                        Data: "Password Reset!!!"
                                    }
                                },
                                Source:  "password_reset@csye6225-fall2018-"+process.env.DomainUser+".me"
                            };
                        
                            console.log('===SENDING EMAIL===');
                            var email = ses.sendEmail(eParams, function(err, data){
                                if(err) console.log(err);
                                else {
                                    console.log("===EMAIL SENT===");
                                    console.log(data);
                        
                        
                                    console.log("EMAIL CODE END");
                                    console.log('EMAIL: ', email);
                                    context.succeed(event);
                        
                                }
                            });
            	});
                
            }
        }
 
    });
    
}
