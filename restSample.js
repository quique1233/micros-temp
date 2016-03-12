if (Meteor.isClient) {
  Template.hello.onCreated(function() {
    this.checkchart = new ReactiveVar(true);
  });
  Template.hello.onRendered(function () {
    this.autorun(function () {
      Template.instance().checkchart.get();
      let temperatures = Temperatures.find({}, {sort: {date: -1}, limit: 100 }).fetch();
      temperatures = _.uniq(temperatures, function(temp) {
        return Math.round(temp.temperature);
      });
      let values = [];
      _.each(temperatures, function(temp) {
        let arr = [];
        arr.push(temp.date);
        arr.push(temp.temperature);
        values.push(arr);
      });
      let data = [
        {
          "key": "Series 1",
          "values": values
      }];

      nv.addGraph(function() {
        var lineChart = nv.models.cumulativeLineChart()
          .x(function(d) { return d[0] })
          .y(function(d) { return d[1] })
          .color(d3.scale.category10().range())
          .useInteractiveGuideline(true)
          .forceY([0])
          .margin({right: 30})
          ;

        lineChart.xAxis
          .tickFormat(function(d) {
            return d3.time.format('%d/%m/%Y')(new Date(d));
          });

        lineChart.yAxis
        .axisLabel('ºC')
        .tickFormat(d3.format('d'));

        d3.select('#lineChart svg')
          .datum(data)
          .transition().duration(500)
          .call(lineChart)
          ;

        nv.utils.windowResize(lineChart.update);

        return lineChart;
      });

    });
  });

  Template.hello.helpers({
    temperature: function() {
      return Temperatures.find({}, {sort: {date: -1}, limit: 1 }).fetch()[0].temperature;
    },
    humidity: function() {
      return Temperatures.find({}, {sort: {date: -1}, limit: 1 }).fetch()[0].humidity;
    },
    photoresistor: function() {
      return Temperatures.find({}, {sort: {date: -1}, limit: 1 }).fetch()[0].photoresistor;
    },
    temperatures: function () {
      return Temperatures.find({}, {sort: {date: -1}, limit: 10 });
    },
    date: function() {
      return moment(this.date).format('D/M/YYYY HH:mm:ss');
    },
    hot: function() {
      return this.temperature > 23;
    },
    cold: function() {
      return this.temperature <= 10;
    },
    average: function() {
      return this.temperature > 10 && this.temperature <= 23;
    },
    numberOfRecords: function() {
      return Temperatures.find({}).count();
    },
    checkchart: function (){
      return Template.instance().checkchart.get();
    },
    allRecords: function() {
      return Temperatures.find({});
    }
  });

  Template.hello.events({
    'click .ui.button.records': function() {
      Template.instance().checkchart.set(false);
    },
    'click .ui.button.graph': function() {
      Template.instance().checkchart.set(true);
    }
  })
}
