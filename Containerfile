from docker.io/library/nginx:mainline-alpine
COPY html           /usr/share/nginx/html
COPY nginx.conf     /etc/nginx
