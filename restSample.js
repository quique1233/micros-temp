if (Meteor.isClient) {
  Template.hello.helpers({
    temperatures: function () {
      return Temperatures.find({});
    },
    date: function() {
      return moment(this.date).format('D/M/YYYY HH:mm');
    }
  });
}
