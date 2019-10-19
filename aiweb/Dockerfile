FROM risingstack/alpine:3.7-v8.10.0-4.8.0

WORKDIR /app

# Install yarn
RUN mkdir -p /opt
ADD latest.tar.gz /opt/
RUN mv /opt/yarn-v1.17.3 /opt/yarn
ENV PATH "$PATH:/opt/yarn/bin"

##Uncomment till HTTP_PROXY line for GE Proxy
#RUN yarn config set proxy http://3.20.109.242:9400/
#RUN yarn config set https-proxy http://3.20.109.242:9400/
#RUN npm config set proxy http://3.20.109.242:9400/
#RUN npm config set https-proxy http://3.20.109.242:9400/
#RUN yarn config set "strict-ssl" false
#ENV HTTP_PROXY http://3.20.109.242:9400/

#ENV npm install -g node-pre-gyp

ADD package.json yarn.lock /tmp/

# Install packages
RUN cd /tmp && yarn
RUN mkdir -p /app && cd /app && ln -s /tmp/node_modules

# Copy the code
ADD app.js /app
ADD inferserver_pb.js /app
ADD inferserver_grpc_pb.js /app
ADD config.js /app
ADD config.yml /app
ADD build /app/build

CMD ["node","app.js"]
