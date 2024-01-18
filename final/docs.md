mosquitto_pub -h localhost -p 1883  -t test -m '[1,"admin:Think_123@192.168.0.250:554"]'

ffmpeg -rtsp_transport tcp  -re -i rtsp://admin:Think_123@192.168.0.250:554  -preset ultrafast -tune zerolatency -c copy -f flv rtmp://192.168.106.90:1935/edge1/dev2.flv

ffmpeg -rtsp_transport tcp  -re -i rtsp://admin:Think_123@192.168.0.250:554 -preset veryfast -tune zerolatency  -c copy -f flv http://192.168.106.90:1935/edge1/dev2.flv


ffmpeg -rtsp_transport tcp  -re -i rtsp://admin:admin@192.168.0.87:1935   -c copy -f flv http://192.168.106.90:1935/edge1/dev2.flv