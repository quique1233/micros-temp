Temperatures = new Meteor.Collection('temperature');

if (Meteor.isServer) {
   // When Meteor starts, create new collection in Mongo if not exists.

// GET /temperature - returns every temperature from MongoDB collection.

Router.route('/temperature', {where: 'server'})
    .get(function(){
        var response = Temperatures.find().fetch();
        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(response));
    })

  // POST /temperature - {temperature as post data}
  // Add new message in MongoDB collection.

    .post(function(){
        var response;
        if (this.request.body.temperature === undefined
            || this.request.body.temperature === null
            || this.request.body.temperature === ""
            || this.request.body.humidity === undefined
            || this.request.body.humidity === null
            || this.request.body.humidity === ""
            || this.request.body.photoresistor === undefined
            || this.request.body.photoresistor === null
            || this.request.body.photoresistor === ""
            //Bad reading from pi
            || this.request.body.temperature < -300) {
            response = {
                "error": true,
                "message": "invalid data"
            };
        } else {
            Temperatures.insert({
                temperature: this.request.body.temperature,
                humidity: this.request.body.humidity,
                photoresistor: this.request.body.photoresistor,
                date: new Date()
            });
            response = {
                "error": false,
                "message": "temperature added."
            };
        }
        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(response));
    });
}
