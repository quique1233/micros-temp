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
            || this.request.body.temperature === "") {
            response = {
                "error": true,
                "message": "invalid data"
            };
        } else {
            Temperatures.insert({
                temperature: this.request.body.temperature,
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
