from onnxruntime.quantization import QuantType, quantize_dynamic


def quantize_model(input_path, output_path):
    quantize_dynamic(input_path, output_path, weight_type=QuantType.QUInt8)