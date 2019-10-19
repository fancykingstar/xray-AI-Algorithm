import logging
import os
import struct
from ast import literal_eval

import cv2
import matplotlib
import numpy as np

IncorrectInputSizeError = Exception
InvalidInputFileNameError = Exception
InvalidJsonInputError = Exception

matplotlib.use('agg')
import matplotlib.pyplot as plt  # noqa: E402 isort:skip


logger = logging.getLogger(__name__)

ALPHA = 0.25
THRESHOLD = 40.
MAPS = sorted(m for m in plt.cm.datad)
LOWER_MAPS = np.array([map_option.lower() for map_option in MAPS])
BYTE_ORDERS = ['@', '=', '<', '>', '!']
FORMAT_CHARACTERS = ['x', 'c', 'b', 'B', '?', 'h', 'H', 'i', 'I', 'l', 'L', 'q', 'Q', 'f', 'd', 's', 'p', 'P']
BYTE_ORDER_KEY = 'BINARY_BYTE_ORDER'
ENCODING_KEY = 'BINARY_ENCODING'


def parse_input(json_data):
    """Parse image input from JSON request

    Will parse input image as a file, binary file, pixel array,
    or binary pixel array

    Args:
        json_data   (dict): JSON request data

    Returns:
        dictionary containing a numpy array representing the input image

    Raises:
        InvalidJsonInputError: Input data is not present in JSON
    """
    execution_id = None
    if 'executionId' in json_data:
        execution_id = json_data['executionId']

    if 'fileName' in json_data:
        # read filename
        img = file2img(_get_absolute_path(json_data['fileName']), execution_id)
    elif 'data' in json_data:
        # read pixel array
        img_data = json_data['data']
        img = img_reshape(img_data, json_data['shape'])
    elif 'binaryData' in json_data:
        # read binary pixel string
        img = bin2img(literal_eval(json_data['binaryData']), json_data['shape'], execution_id=execution_id)
    elif 'binaryFileName' in json_data:
        # read binary data from file
        img = bin_file2img(_get_absolute_path(json_data['binaryFileName']), json_data['shape'], execution_id=execution_id)
    else:
        raise InvalidJsonInputError(execution_id, "Input data is not present in JSON")
    return {"img": img}



def bin2img(binary_data, shape, byte_order='<', encoding="H", execution_id=None):
    """Convert binary encoded image data to a numpy array

    Byte order and encoding environment variables will override
    inputs byte_order and encoding

    Args:
        binary_data (str): Binary image data encoded using the specified encoding scheme
        shape       (tuple): shape of image in (h, w) format
        byte_order  (str): Optional, byte encoding format, default=< (little endian)
        encoding    (str): Optional, encoding format as defined by the python format characters
                            default=H (unsigned short)
        execution_id (str): unique id for this request

    Returns:
        numpy array representation of input image

    Raises:
        IOError: Byte order and encoding must be strings
        IOError: Invalid byte order supplied
        IOError: Invalid encoding supplied
        IncorrectInputSizeError: Shape parameters do not match binary data size
    """
    # Get encoding and byte_order from environment vars if available
    byte_order = os.getenv(BYTE_ORDER_KEY, byte_order)
    encoding = os.getenv(ENCODING_KEY, encoding)
    if not isinstance(byte_order, str) or not isinstance(encoding, str):
        raise IOError("Byte order and encoding must be strings")
    if byte_order not in BYTE_ORDERS:
        raise IOError("Invalid byte order supplied")
    if encoding not in FORMAT_CHARACTERS:
        raise IOError("Invalid encoding supplied")
    # Verify size of input data against expected encoding
    num_pixels = int(len(binary_data)/struct.calcsize(encoding))
    expected_size = reduce(lambda x, y: int(x)*int(y), shape)
    if expected_size != num_pixels:
        raise IncorrectInputSizeError(execution_id, "Shape parameters do not match binary data size")
    # Construct the format and unpack the data
    fmt = byte_order + encoding*num_pixels
    img_data = struct.unpack(fmt, binary_data)
    img = img_reshape(img_data, shape)
    return img



def bin_file2img(binary_fname, shape, byte_order='<', encoding='H', execution_id=None):
    """Convert binary encoded image data from file to a numpy array

    Args:
        binary_fname (str): Filename of binary image data encoded using the specified encoding scheme
        shape       (tuple): shape of image in (h, w) format
        byte_order  (str): Optional, byte encoding format, default=< (little endian)
        encoding    (str): Optional, encoding format as defined by the python format characters
                            default=H (unsigned short)
        execution_id (str): unique id for this request
    """
    with open(binary_fname, 'rb') as fopen:
        binary_data = fopen.read()
    return bin2img(binary_data, shape, byte_order, encoding, execution_id)



def file2img(filename, execution_id=None):
    """Read a grayscale image from a filename

    Args:
        filename    (str): File name from which to read image data
        execution_id (str): unique id for this request

    Returns:
        img     (np.ndarray): Numpy array containing image data

    Raises:
        InvalidInputFileNameError: Unable to read input filename <filename>
    """
    img = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
    if img is None:
        err_msg = "Unable to read input filename: {}".format(filename)
        logger.error(err_msg)
        raise InvalidInputFileNameError(execution_id, err_msg)
    return img



def img_resize(img, shape, method=None):
    """Resize an image to the specified width and height

    Args:
        img     (np.ndarray): Input image to be resized
        shape   (tuple): Tuple containing the desired width and height formatted as (height, width)
        method  (string): optional. fit, crop, or None (default cv2 resize)

    Returns:
        resized_img     (np.ndarray): Resized image

    Raises:
        RuntimeError: Unable to resize input image: <error_message>

    """
    if method == 'crop':
        # crop
        try:
            resized_img = _resize_keeping_aspect_ratio(img, shape, "crop")
        except Exception as e:
            err_msg = "Unable to resize input image: {}".format(e)
            logger.error(err_msg)
            raise RuntimeError(err_msg)

    elif method == "fit":
        # fit
        try:
            resized_img = _resize_keeping_aspect_ratio(img, shape, "fit")
        except Exception as e:
            err_msg = "Unable to resize input image: {}".format(e)
            logger.error(err_msg)
            raise RuntimeError(err_msg)
    else:
        # default resize
        try:
            resized_img = cv2.resize(img, (shape[1], shape[0])).astype(np.float32)
        except Exception as e:
            err_msg = "Unable to resize input image: {}".format(e)
            logger.error(err_msg)
            raise RuntimeError(err_msg)
    return resized_img



def _resize_keeping_aspect_ratio(image_data, shape, method="fit"):
    """Resizes an image keeping the aspect ratio. Depending on the specified method the resized image is either
    padded with zeros, or cropped to fit the target shape
    :param image_data: numpy array containing the input image
    :param height: the target height
    :param width: the target width
    :param: method: one of "fit" or "crop"
    :return: numpy array containing the resized image
    """
    input_size = image_data.shape

    if len(input_size) != 2 or len(shape) != 2:
        raise IOError("Input is expected to be a 2D image, received shape is {}".format(input_size))

    height, width = shape
    height_factor = 1.0 * height / input_size[0]
    width_factor = 1.0 * width / input_size[1]
    if method == "fit":
        factor = min(height_factor, width_factor)
    elif method == "crop":
        factor = max(height_factor, width_factor)
    else:
        raise IOError("Unknown resize method {}. Expected to be one of 'fit' or 'crop'.".format(method))
    tmp_height, tmp_width = (int(input_size[0]*factor), int(input_size[1]*factor))
    tmp_image = cv2.resize(image_data, (tmp_width, tmp_height))  # cv2 needs width and height in reverse order
    output_image = _crop_or_expand_image(tmp_image, (height, width))
    return output_image


def _crop_or_expand_image(input_image, target_size):
    """Crops or expands an image to a target size keeping the same image center
    :param input_image: numpy array containing the input image
    :param target_size: 2-element tuple or list containing the target size as (height, width)
    :return: numpy array containing the cropped or padded image
    """
    input_size = np.array(input_image.shape)
    output_shape = np.array(target_size)
    min_shape = np.minimum(input_size, output_shape)

    output_image = np.zeros(target_size, dtype=input_image.dtype)

    in_start_indices = (input_size - min_shape) // 2
    in_end_indices = in_start_indices + min_shape
    out_start_indices = (output_shape - min_shape) // 2
    out_end_indices = out_start_indices + min_shape

    output_image[out_start_indices[0]:out_end_indices[0], out_start_indices[1]:out_end_indices[1]] = \
        input_image[in_start_indices[0]:in_end_indices[0], in_start_indices[1]:in_end_indices[1]]

    return output_image


def img_rescale(img, min=0, max=1):
    """Rescale an image between min and max

    Args:
        img     (np.ndarray): input image requiring rescaling
        min     (int, float, long): minimum value to scale the image to
        max     (int, float, long): maximum value to scale the image to
    Returns:
        rescaled_img    (np.ndarray): image rescaled between min and max
    """
    if not isinstance(img, np.ndarray):
        raise IOError("Image data must be a numpy array")
    if not isinstance(max, (int, float)) or not isinstance(min, (int, float)):
        raise ValueError("Minimum and maximum rescale values must be a number")
    if max <= min:
        raise ValueError("Maximum must be greater than minimum value for image scaling")
    rescaled_img = cv2.normalize(img.astype(np.float32), None, alpha=min, beta=max, norm_type=cv2.NORM_MINMAX)
    return rescaled_img



def img_reshape(img, shape):
    """Reshape an input image to the given shape

    Args:
        img     (np.ndarray or list): Input image data to be reshaped
        shape   (tuple): Tuple containing the desired width and height formatted as (height, width) or (height, width, depth)

    Returns:
        reshaped_img    (np.ndarray): Reshaped image

    Raises:
        RuntimeError: Unable to reshape input image: <error_message>
        IOError: Input shape does not match image data size
    """
    if not isinstance(shape, tuple) and not isinstance(shape, list) or len(shape) < 2 or len(shape) > 4:
        err_msg = "Shape input must be a list or tuple formatted as (height, width), (depth, height, width), or (depth, height, width, 1)"
        logger.error(err_msg)
        raise IOError(err_msg)
    try:
        reshaped_img = np.reshape(img, shape).astype(np.float32)
    except Exception as e:
        err_msg = "Unable to reshape input image: {}".format(e)
        logger.error(err_msg)
        raise RuntimeError(err_msg)

    return reshaped_img



def format_data_return(data_json, tensor_proto, input_dict):
    """Format the return to make a PredictionRequest

    Args:
        data_json       (dict): Dictionary containing inputs from API call
        tensor_proto    (tensor_proto data): Data to be used for forming PredictionRequest
        input_dict      (dict): Dictionary containing formatted inputs passed to pre_process
    """
    data = {}
    data['data'] = tensor_proto
    data['execution_id'] = data_json['executionId']
    data["input"] = input_dict
    if "modelVersion" in data_json:
        data['model_version'] = data_json["modelVersion"]
    return data



def gen_heatmap(img_data, mask_data, out_fname=None, cmap_name='jet'):
    """Generates a composite heatmap image using a defined colormap

    Uses colormaps defined by matplotlib as seen here:
    https://matplotlib.org/examples/color/colormaps_reference.html
    Threshold, alpha, and colormap name will be overwritten by
    environment variables if present. If the img_data and mask_data are
    not the same dimensions in height and width, then the input img_data
    will be resized to the height and width of the mask_data using the
    "fit" resize method. Any value in the mask_data less than the threshold
    will not be converted to the colormap. The alpha parameter indicates the
    desired opacity of the output colormap.

    Args:
        img_data    (np.array): the image data to be overlayed with the mask data
        mask_data   (np.array): the mask data to be converted to a heatmap
        out_fname   (string): optional, location to write out result, if not provided the
                                pixel data will be returned
        cmap_name   (string): optional, colormap name, case insensitive, default=jet

    Returns:
        string: file location where blended image was saved
        or
        np.array: image data containing blended mask data if out_fname not provided
    """
    # Check environment variables for threshold and alpha parameters
    threshold = _get_threshold()
    alpha = _get_alpha()

    # verify colormap is valid
    cmap = _get_colormap(cmap_name)

    # verify img and mask inputs
    if not isinstance(mask_data, np.ndarray) or not isinstance(img_data, np.ndarray):
        err_msg = "Image and mask data must be numpy arrays"
        logger.error(err_msg)
        raise IOError(err_msg)
    if not len(mask_data.shape) == 2:
        err_msg = "Mask data must be 2-dimensional"
        logger.error(err_msg)
        raise IOError(err_msg)

    # Ensure mask and image data are scaled properly
    if np.max(mask_data) <= 1.0 or np.max(img_data) > 255:
        logger.warn("Mask data should be scaled between 0-255, applying rescale")
        mask_data = img_rescale(mask_data, 0., 255.)
    if np.max(img_data) <= 1.0 or np.max(img_data) > 255:
        logger.warn("Image data should be scaled between 0-255, applying rescale")
        img_data = img_rescale(img_data, 0., 255.)

    # Ensure mask and image data are same size
    img_data = _match_size(img_data, mask_data)

    # Ensure mask data is the correct type
    mask_data = mask_data.astype('uint8')

    # Blend mask and img
    blended = _blend_img(img_data, mask_data, cmap, alpha, threshold)

    # Convert to BGR and write to file or return blended image
    if out_fname is not None:
        blended = cv2.cvtColor(blended, cv2.COLOR_RGB2BGR)
        if not cv2.imwrite(out_fname, blended):
            raise IOError("Unable to write blended image to file")
        return out_fname
    #return blended
    return cv2.cvtColor(blended, cv2.COLOR_RGB2BGR)



def _blend_img(img_data, mask_data, cmap, alpha, threshold):
    """Blend the image data and mask data using the colormap

    Arguments:
        img_data    (np.ndarray): image data to be blended
        mask_data   (np.ndarray): mask data to be blended
        cmap        (np.ndarray): Colormap LUT resulting from _get_colormap()
        alpha       (float): Alpha to apply to blended image
        threshold   (int):  Threshold to apply to blended image
    Returns:
        blended image
    """
    cmap[0] = 0
    mask_cmap = cmap[mask_data] * alpha
    if len(img_data.shape) == 3:
        img_data[mask_cmap > 0] = img_data[mask_cmap > 0] * (1 - alpha)
        blended = (img_data + mask_cmap).astype('uint8')
    else:
        blended = np.zeros(mask_cmap.shape, dtype='uint8')
        img_data[mask_data > 0] = img_data[mask_data > 0] * (1 - alpha)
        for i in range(3):
            blended[:, :, i] = img_data + mask_cmap[:, :, i]
    return blended


def _match_size(img_data, mask_data):
    """Ensures that image data and mask data are the same size

    If they are not the same size, the img_data will be resized
    to match the mask data dimensions

    Arguments:
        img_data    (np.ndarray): image array to resize
        mask_data   (np.ndarray): mask array of target dimensions

    Returns:
        resized img_data

    Raises:
        IOError: Image data must be a 2D grayscale or 3D RGB image
    """
    img_shape = img_data.shape
    mask_shape = mask_data.shape
    if not mask_shape == img_shape[0:2]:
        if len(img_shape) == 2:
            logger.debug("Applying resize to image")
            img_data = img_resize(img_data, mask_shape, method='fit')
        elif len(img_shape) == 3 and img_shape[2] == 3:
            new_img = np.zeros([mask_shape[0], mask_shape[1], 3])
            for channel in range(3):
                logger.debug("Applying resize to channel {}".format(channel))
                new_img[:, :, channel] = img_resize(img_data[:, :, channel], mask_shape, method="fit")
            img_data = new_img.copy()
            del new_img
        else:
            err_msg = "Image data must be a 2D grayscale or 3D RGB image"
            logger.error(err_msg)
            raise IOError(err_msg)
    return img_data


def _get_colormap(cmap_name):
    """Returns a colormap look up table (LUT)

    Will attempt to locate the saved file LUT but will
    generate using matplotlib dynamically if the file
    cannot be found

    Args:
        cmap_name   (str): Colormap name (case-insensitive), will use definition from
                            environment variables first, if present

    Returns:
        colormap LUT

    Raises:
        IOError: Invalid colormap name supplied
    """
    cmap_name = os.environ.get("HEATMAP_COLORMAP", cmap_name)
    if isinstance(cmap_name, (bytes, str)) and cmap_name.lower() in LOWER_MAPS:
        cmap_name = MAPS[np.where(str(cmap_name).lower() == LOWER_MAPS)[0][0]]
        cmap_filename = os.path.join("/root", "{}.npy".format(cmap_name.lower()))
        if os.path.isfile(cmap_filename):
            lut = np.load(cmap_filename)
        else:
            logger.debug("Unable to locate pre-saved LUT, creating dynamically")
            cmap = plt.get_cmap(cmap_name)
            lut = cmap(range(0, 256))[:, 0:-1] * 255
        logger.debug("Using {} colormap".format(cmap_name))
    else:
        raise IOError("Invalid colormap name supplied: {}".format(cmap_name))
    return lut


def _get_alpha():
    """Returns alpha value for heatmap generation purposes

    Returns:
        alpha for opacity in colormap generation
    """
    alpha = os.environ.get("HEATMAP_ALPHA", ALPHA)
    if not isinstance(alpha, (float, int)) or alpha < 0 or alpha > 1:
        try:
            alpha = float(alpha)
        except (ValueError, TypeError):
            logger.warn("Invalid HEATMAP_ALPHA environment variable supplied, defaulting to {}".format(ALPHA))
            alpha = ALPHA
    return alpha


def _get_threshold():
    """Returns threshold value for heatmap generation purposes

    Returns:
        threshold under which the colormap will not be applied
    """
    threshold = os.environ.get("HEATMAP_THRESHOLD", THRESHOLD)
    if not isinstance(threshold, int) or threshold < 0 or threshold > 255:
        try:
            threshold = int(threshold)
        except (ValueError, TypeError):
            logger.warn("Invalid HEATMAP_THRESHOLD environment variable supplied, defaulting to {}".format(THRESHOLD))
            threshold = THRESHOLD
    return threshold


def _get_absolute_path(path):
    """Returns the absolute path using the configuration base path

    Args:
        path    (str): Path from which to generate the absolute path

    Returns:
        absolute path using the configuration parameters
    """
    base_path = "."
    absolute_path = os.path.join(base_path, path)
    return absolute_path
