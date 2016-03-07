if (Meteor.isClient) {
    Router.route('/', function(){
        this.render('hello');
    });
}
