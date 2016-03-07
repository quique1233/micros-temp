if (Meteor.isClient) {
  Template.hello.onRendered(function () {
    this.autorun(function () {
      let temperatures = Temperatures.find({}, {sort: {date: -1}, limit: 10 }).fetch();
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
        var chart = nv.models.cumulativeLineChart()
          .x(function(d) { return d[0] })
          .y(function(d) { return d[1] })
          .color(d3.scale.category10().range())
          .useInteractiveGuideline(true)
          .forceY([0])
          .margin({right: 30})
          ;

        chart.xAxis
          .tickFormat(function(d) {
            return d3.time.format('%d/%m/%Y')(new Date(d));
          });

        chart.yAxis
        .axisLabel('ºC')
        .tickFormat(d3.format('d'));

        d3.select('#chart svg')
          .datum(data)
          .transition().duration(500)
          .call(chart)
          ;

        nv.utils.windowResize(chart.update);

        return chart;
      });
    });
  });

  Template.hello.helpers({
    temperatures: function () {
      return Temperatures.find({}, {sort: {date: -1}, limit: 10 });
    },
    date: function() {
      return moment(this.date).format('D/M/YYYY HH:mm');
    },
    lastRecord: function() {
      return Temperatures.find({}, {sort: {date: -1}, limit: 1 }).fetch()[0].temperature;
    },
    hot: function() {
      return this.temperature > 23;
    },
    cold: function() {
      return this.temperature <= 10;
    },
    average: function() {
      return this.temperature >= 15 && this.temperature <= 23;
    }
  });
}
