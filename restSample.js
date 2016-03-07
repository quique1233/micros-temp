if (Meteor.isClient) {
  Template.hello.helpers({
    temperatures: function () {
      return Temperatures.find({});
    }
  });
}
