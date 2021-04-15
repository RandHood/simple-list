FROM node:14

ADD start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]