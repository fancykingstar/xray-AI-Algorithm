import os
import numpy as np
import keras_model_io
from keras.models import Model
import cv2
import tensorflow as tf

def get_predictions(image, local_predictor):
    predict_response = local_predictor({"inputs": image})
    prediction = predict_response['cls'][0]

    image_pred = prediction[0]
    patch_pred = predict_response['mask'][0][:, :, 0]
    return image_pred, patch_pred


def get_keras_predictions(image, model, graph):
    _, height, width, _ = model.layers[0].input_shape
    image_size = [height,width]
    """
    resized_image = cv2.resize(image[0], tuple(image_size))
    resized_image = resized_image[None, :, :, :]
    results = model.predict(resized_image)
    """
    with graph.as_default():
        results = model.predict(image)
        image_pred = float(np.squeeze(results[0]))
        patch_pred = np.squeeze(results[1])
        return image_pred, patch_pred


def get_predictor_function(model_path, model_weights=None):
    if os.path.isfile(model_path):
        if not model_path.endswith(".json"):
            print("model path must be a folder or a .json file")

        if model_weights is None:
            print("Supplying model weights is mandatory in case of keras models")
            raise IOError
        else:
            model = keras_model_io.load_model_struct_and_weights(model_path, model_weights)
            model._make_predict_function()
            graph = tf.get_default_graph()
            prediction_function = lambda image: get_keras_predictions(image, model, graph)
    else:
        local_predictor = tf.contrib.predictor.from_saved_model(model_path)
        prediction_function = lambda image: get_predictions(image, local_predictor)
    return prediction_function
