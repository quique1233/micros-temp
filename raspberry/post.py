#!/usr/local/bin/python

import RPi.GPIO as GPIO
import urllib2
import urllib
import time
import pigpio
import DHT22

pi = pigpio.pi()

#dth22 sensor definition
dht22 = DHT22.sensor(pi, 16)
dht22.trigger()

GPIO.setmode(GPIO.BOARD)

#define the pin that goes to the circuit
pin_to_circuit = 7

def rc_time (pin_to_circuit):
    count = 0
  
    #Output on the pin for 
    GPIO.setup(pin_to_circuit, GPIO.OUT)
    GPIO.output(pin_to_circuit, GPIO.LOW)
    time.sleep(0.1)

    #Change the pin back to input
    GPIO.setup(pin_to_circuit, GPIO.IN)
  
    #Count until the pin goes high
    while (GPIO.input(pin_to_circuit) == GPIO.LOW):
        count += 1

    return count

def post():
	dht22.trigger()
	humidity = '%.2f' % (dht22.humidity())
	temp = '%.2f' % (dht22.temperature())
	photoresistor = rc_time(pin_to_circuit)
	query_args = {"temperature": temp, "humidity": humidity, "photoresistor": photoresistor}
	url = 'http://micros-temp.meteor.com/temperature'
	data = urllib.urlencode(query_args)
	request = urllib2.Request(url, data)
	response = urllib2.urlopen(request).read()
	print response

try:
	while True:
		post()
		time.sleep(3)
except KeyboardInterrupt:
    	pass
finally:
    	GPIO.cleanup()
