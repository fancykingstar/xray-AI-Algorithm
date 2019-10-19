from keras.models import model_from_json


def load_model_struct_and_weights(json_file, weight_file):
    """Load a keras model from a pair of json and hdf5 files containing structure and weights respectively
    :param json_file: name of input json file storing model structure
    :param weight_file: name of input hdf5 file storing model weights
    :return: the loaded keras model
    """
    with open(json_file, "r") as textFile:
        json_string = textFile.read()
    model = model_from_json(json_string)
    model.load_weights(weight_file)
    return model


def save_model_struct_and_weights(model, json_file, weight_file):
    """Saves a keras model to a pair of json and hdf5 files containing structure and weights respectively
    :param model: keras model to save
    :param json_file: name of output json file storing model structure
    :param weight_file: name of output hdf5 file storing model weights
    :return: None
    """
    with open(json_file, "w") as textFile:
        textFile.write(model.to_json())
    model.save_weights(weight_file)
