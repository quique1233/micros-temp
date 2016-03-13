if (Meteor.isClient) {
  Template.hello.onCreated(function() {
    this.checkchart = new ReactiveVar(true);
    this.chartFor = new ReactiveVar('temperature');
  });
  Template.hello.onRendered(function () {
    this.autorun(function () {
      Template.instance().checkchart.get();
      let chartFor = Template.instance().chartFor.get();
      let temperatures = Temperatures.find({}, {sort: {date: -1}, limit: 10 }).fetch();
      let configuration = {};
      switch (chartFor) {
        case 'temperature':
          configuration.color = "#FE2E2E";
          configuration.ranges = [-10,-5, 0, 5,10,15,20,25,30,35,40];
          configuration.attr = chartFor;
          configuration.ylabel = "ºC";
          configuration.label = "temperatura ºC";
          break;
        case 'humidity':
          configuration.color = "#31B404";
          configuration.ranges = [20,30, 40, 50, 60, 70,80,90,100];
          configuration.attr = chartFor;
          configuration.ylabel = "%";
          configuration.label = "% humedad";
          break;
        case 'photoresistor':
          configuration.color = "#FFFF00";
          configuration.ranges = [0, 20000];
          configuration.attr = chartFor;
          configuration.ylabel = "fotoresistor";
          configuration.label = "fotoresistor";
          break;
      }
      let values = [];
      _.each(temperatures, function(temp) {
        let arr = [];
        arr.push(temp.date);
        arr.push(temp[configuration.attr]);
        values.push(arr);
      });
      let data = [
        {
          "key": configuration.label,
          "values": values,
          "color": configuration.color
      }];

      nv.addGraph(function() {
        var lineChart = nv.models.lineChart()
          .x(function(d) { return d[0] })
          .y(function(d) { return d[1] })
          .color(d3.scale.category10().range())
          .useInteractiveGuideline(false)
          .forceY(configuration.ranges)
          .margin({right: 30})
          ;

        lineChart.xAxis
          .showMaxMin(false)
          .tickFormat(function(d) {
            return d3.time.format('%d/%m/%Y')(new Date(d));
          });

        lineChart.yAxis
        .axisLabel(configuration.label)
        .tickFormat(d3.format(',.2f'));

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
    currentTemperature: function() {
      return Temperatures.find({}, {sort: {date: -1}, limit: 1 }).fetch()[0].temperature;
    },
    currentHumidity: function() {
      return Temperatures.find({}, {sort: {date: -1}, limit: 1 }).fetch()[0].humidity;
    },
    currentPhotoresistor: function() {
      return Temperatures.find({}, {sort: {date: -1}, limit: 1 }).fetch()[0].photoresistor;
    },
    lastTenTemperatures: function () {
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
      return Temperatures.find({}, {sort: {date: -1}});
    }
  });

  Template.hello.events({
    'click .ui.button.graph': function() {
      Template.instance().checkchart.set(true);
    },
    'click #export': function() {
      $("#table").tableToCSV();
    },
    'click .humidity': function() {
      Template.instance().chartFor.set('humidity');
    },
    'click .temperature': function() {
      Template.instance().chartFor.set('temperature');
    },
    'click .photoresistor': function() {
      Template.instance().chartFor.set('photoresistor');      
    },
    'click .allrecords': function() {
      Template.instance().checkchart.set(false);
    }
  })
}
