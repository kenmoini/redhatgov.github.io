FROM registry.access.redhat.com/ubi7/php-73:latest

USER root

RUN mkdir /opt/app-src

COPY . /opt/app-src

RUN cd /opt/app-src \
 && bin/hugo \
 && mv public/ /var/html/www

# Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:0 /var/www/ && chmod -R ug+rwx /var/www/ && \
    chown -R 1001:0 ${APP_ROOT} && chmod -R ug+rwx ${APP_ROOT} && \
    rpm-file-permissions

USER 1001

CMD "/usr/libexec/s2i/run"