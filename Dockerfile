FROM node:10-alpine as builder

RUN mkdir /opt/app-src

COPY . /opt/app-src

RUN apk --update --no-cache add asciidoctor util-linux asciidoc \
 && cd /opt/app-src/themes/pf4-redhat/static \
 && npm install \
 && cd /opt/app-src \
 && bin/hugo

FROM registry.access.redhat.com/rhscl/httpd-24-rhel7:latest

USER root
RUN mkdir -p /var/www/html
COPY --from=builder /opt/app-src/public /var/www/html

# Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:0 /var/www/ && chmod -R ug+rwx /var/www/ && \
    chown -R 1001:0 ${APP_ROOT} && chmod -R ug+rwx ${APP_ROOT} && \
    rpm-file-permissions

USER 1001