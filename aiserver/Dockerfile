##Comment below if using GPU
FROM intelaipg/intel-optimized-tensorflow:latest-mkl-py3

##Uncomment below if using GPU
#FROM tensorflow/tensorflow:1.12.0-gpu-py3

#Uncomment for GE Proxy
#ENV http_proxy http://3.20.109.242:9400/
#ENV https_proxy http://3.20.109.242:9400/

WORKDIR /app

#Comment line below if using GPU. For some reason it gives error
RUN apt-get update

RUN apt-get install -y libsm6 libxext6 libxrender-dev
RUN pip install opencv-python
RUN pip install pydicom
RUN pip install pyyaml
RUN pip install keras

COPY ./*.py /app/
COPY ./config.yml /app/
COPY ./python3-gdcm.deb /tmp
RUN cd /tmp && dpkg -i python3-gdcm.deb && ldconfig
RUN echo "PYTHONPATH=/usr/local/lib" >> ~/.profile

EXPOSE 50051

CMD ["python","-u","aiserver.py"]
