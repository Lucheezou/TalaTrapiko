import sys
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from PIL import Image, ImageDraw
import csv
import os
import time
from matplotlib import pyplot as plt

# Load data and preprocessing parameters
dataX = joblib.load("dataX")
d_mean = joblib.load("data_mean")
d_std = joblib.load("data_std")

# Specify the weights file name and the number of moves
filename = "weights-improvement-388-0.0241.keras"
num_moves = 500

# Define model architecture
model = tf.keras.Sequential([
    tf.keras.layers.LSTM(512, input_shape=(None, 34), return_sequences=True),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.LSTM(512),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(34, activation='linear')
])

# Compile the model with the same loss function and optimizer as used during training
model.compile(loss=tf.keras.losses.mean_squared_error, optimizer='rmsprop')

# Load weights
try:
    model.load_weights(filename)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model weights: {e}")

sequence_length = 5

# Generate new moves
if model.weights:
    start = np.random.randint(0, len(dataX) - sequence_length)
    pattern = dataX[start]

    moves = []
    for i in range(num_moves):
        print(f"Generating step {i + 1}")
        x = np.reshape(pattern, (1, sequence_length, len(pattern[0])))
        new_move = model.predict(x)
        moves.append(new_move)
        pattern = np.append(pattern, new_move, axis=0)
        pattern = pattern[1:]

    moves = np.array(moves)
    moves = moves.reshape((-1, 34))
    moves = moves * d_std + d_mean
    newMoves = pd.DataFrame(moves, columns=[
        "NOSE_x", "NOSE_y", "LEFT_EYE_x", "LEFT_EYE_y", "RIGHT_EYE_x", "RIGHT_EYE_y",
        "LEFT_EAR_x", "LEFT_EAR_y", "RIGHT_EAR_x", "RIGHT_EAR_y", "LEFT_SHOULDER_x",
        "LEFT_SHOULDER_y", "RIGHT_SHOULDER_x", "RIGHT_SHOULDER_y", "LEFT_ELBOW_x",
        "LEFT_ELBOW_y", "RIGHT_ELBOW_x", "RIGHT_ELBOW_y", "LEFT_WRIST_x", "LEFT_WRIST_y",
        "RIGHT_WRIST_x", "RIGHT_WRIST_y", "LEFT_HIP_x", "LEFT_HIP_y", "RIGHT_HIP_x",
        "RIGHT_HIP_y", "LEFT_KNEE_x", "LEFT_KNEE_y", "RIGHT_KNEE_x", "RIGHT_KNEE_y",
        "LEFT_ANKLE_x", "LEFT_ANKLE_y", "RIGHT_ANKLE_x", "RIGHT_ANKLE_y"])

    # Save new moves
    newMoves.to_csv("skeletal_coordinates.csv", index=False)

# Function to draw a line between two points with a specified width
def draw_line(draw, x1, y1, x2, y2, width=1):
    draw.line([(x1, y1), (x2, y2)], fill="black", width=width)

# Read data from CSV file
def read_csv(file_path):
    data = []
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data

# Normalize coordinates between 0 and 289
def normalize_coordinate(value):
    min_value = 0
    max_value = 289
    return (float(value) - min_value) / (max_value - min_value) * (max_value - min_value) + min_value

# Find the center point of the stick figure
def find_center(data):
    keys = data.keys()
    common_keys = set(key[:-2] for key in keys if key.endswith('_x') or key.endswith('_y'))
    all_x = [float(data[key + '_x']) for key in common_keys]
    all_y = [float(data[key + '_y']) for key in common_keys]
    min_x = min(all_x)
    max_x = max(all_x)
    min_y = min(all_y)
    max_y = max(all_y)
    center_x = (min_x + max_x) / 2
    center_y = (min_y + max_y) / 2
    return center_x, center_y

def draw_stick_figure(data, index, folder_path, offset_x=0, offset_y=0):
    image = Image.new("RGB", (400, 400), "white")
    draw = ImageDraw.Draw(image)

    center_x, center_y = find_center(data)

    draw.ellipse([(normalize_coordinate(data['NOSE_x']) - center_x - 16 + offset_x,
                   normalize_coordinate(data['NOSE_y']) - center_y - 16 + offset_y),
                  (normalize_coordinate(data['NOSE_x']) - center_x + 16 + offset_x,
                   normalize_coordinate(data['NOSE_y']) - center_y + 16 + offset_y)], fill="black")

    draw_line(draw, normalize_coordinate(data['LEFT_SHOULDER_x']) - center_x + offset_x,
              normalize_coordinate(data['LEFT_SHOULDER_y']) - center_y + offset_y,
              normalize_coordinate(data['RIGHT_SHOULDER_x']) - center_x + offset_x,
              normalize_coordinate(data['RIGHT_SHOULDER_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['LEFT_SHOULDER_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_SHOULDER_y']) - center_y + offset_y,
              normalize_coordinate(data['LEFT_HIP_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_HIP_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['RIGHT_SHOULDER_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_SHOULDER_y']) - center_y + offset_y,
              normalize_coordinate(data['RIGHT_HIP_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_HIP_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['LEFT_HIP_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_HIP_y']) - center_y + offset_y,
              normalize_coordinate(data['RIGHT_HIP_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_HIP_y']) - center_y + offset_y, width=3)

    draw_line(draw, normalize_coordinate(data['LEFT_SHOULDER_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_SHOULDER_y']) - center_y + offset_y,
              normalize_coordinate(data['LEFT_ELBOW_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_ELBOW_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['RIGHT_SHOULDER_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_SHOULDER_y']) - center_y + offset_y,
              normalize_coordinate(data['RIGHT_ELBOW_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_ELBOW_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['LEFT_ELBOW_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_ELBOW_y']) - center_y + offset_y,
              normalize_coordinate(data['LEFT_WRIST_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_WRIST_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['RIGHT_ELBOW_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_ELBOW_y']) - center_y + offset_y,
              normalize_coordinate(data['RIGHT_WRIST_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_WRIST_y']) - center_y + offset_y, width=3)

    draw_line(draw, normalize_coordinate(data['LEFT_HIP_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_HIP_y']) - center_y + offset_y,
              normalize_coordinate(data['LEFT_KNEE_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_KNEE_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['RIGHT_HIP_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_HIP_y']) - center_y + offset_y,
              normalize_coordinate(data['RIGHT_KNEE_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_KNEE_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['LEFT_KNEE_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_KNEE_y']) - center_y + offset_y,
              normalize_coordinate(data['LEFT_ANKLE_x']) - center_x + offset_x, normalize_coordinate(data['LEFT_ANKLE_y']) - center_y + offset_y, width=3)
    draw_line(draw, normalize_coordinate(data['RIGHT_KNEE_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_KNEE_y']) - center_y + offset_y,
              normalize_coordinate(data['RIGHT_ANKLE_x']) - center_x + offset_x, normalize_coordinate(data['RIGHT_ANKLE_y']) - center_y + offset_y, width=3)

    image.save(os.path.join(folder_path, f"stick_figure_{index}.png"))

# Visualize coordinates
file_path = "skeletal_coordinates.csv"
output_folder = './target'
os.makedirs(output_folder, exist_ok=True)
data = read_csv(file_path)
for index, row in enumerate(data):
    draw_stick_figure(row, index, output_folder, offset_x=200, offset_y=200)

# Loading target images
target_dataset = tf.data.Dataset.list_files(os.getcwd() + '/target/*.png')
d = np.array(list(target_dataset.as_numpy_iterator()))
d.sort()
target_dataset = tf.data.Dataset.from_tensor_slices(d)

BUFFER_SIZE = len(d)
BATCH_SIZE = 1

def resize(input_image, real_image, height, width):
    input_image = tf.image.resize(input_image, [height, width],
                                  method=tf.image.ResizeMethod.NEAREST_NEIGHBOR)
    real_image = tf.image.resize(real_image, [height, width],
                                 method=tf.image.ResizeMethod.NEAREST_NEIGHBOR)
    return input_image, real_image

def load_target(image_file):
    image = tf.io.read_file(image_file)
    image = tf.image.decode_jpeg(image)

    real_image = image
    input_image = image

    input_image = tf.cast(input_image, tf.float32) / 255.
    real_image = tf.cast(real_image, tf.float32) / 255.

    return resize(input_image, real_image, 256, 256)

target_dataset = target_dataset.map(
    load_target, num_parallel_calls=tf.data.experimental.AUTOTUNE).batch(BATCH_SIZE)

# RGB Image
OUTPUT_CHANNELS = 3

# Function for creating downsample layers for the GAN
def downsample(filters, size, apply_batchnorm=True):
    initializer = tf.random_normal_initializer(0., 0.02)

    result = tf.keras.Sequential()
    result.add(
        tf.keras.layers.Conv2D(filters, size, strides=2, padding='same',
                               kernel_initializer=initializer, use_bias=False))

    if apply_batchnorm:
        result.add(tf.keras.layers.BatchNormalization())

    result.add(tf.keras.layers.LeakyReLU())

    return result

# Function for creating upsample layers for the GAN
def upsample(filters, size, apply_dropout=False):
    initializer = tf.random_normal_initializer(0., 0.02)

    result = tf.keras.Sequential()
    result.add(
        tf.keras.layers.Conv2DTranspose(filters, size, strides=2,
                                        padding='same',
                                        kernel_initializer=initializer,
                                        use_bias=False))

    result.add(tf.keras.layers.BatchNormalization())

    if apply_dropout:
        result.add(tf.keras.layers.Dropout(0.5))

    result.add(tf.keras.layers.ReLU())

    return result

# Defining the Generator
def Generator():
    inputs = tf.keras.layers.Input(shape=[256, 256, 3])

    down_stack = [
        downsample(64, 4, apply_batchnorm=False),
        downsample(128, 4),
        downsample(256, 4),
        downsample(512, 4),
        downsample(512, 4),
        downsample(512, 4),
        downsample(512, 4),
        downsample(512, 4),
    ]

    up_stack = [
        upsample(512, 4, apply_dropout=True),
        upsample(512, 4, apply_dropout=True),
        upsample(512, 4, apply_dropout=True),
        upsample(512, 4),
        upsample(256, 4),
        upsample(128, 4),
        upsample(64, 4),
    ]

    initializer = tf.random_normal_initializer(0., 0.02)
    last = tf.keras.layers.Conv2DTranspose(OUTPUT_CHANNELS, 4,
                                           strides=2,
                                           padding='same',
                                           kernel_initializer=initializer,
                                           activation='tanh')

    x = inputs

    skips = []
    for down in down_stack:
        x = down(x)
        skips.append(x)

    skips = reversed(skips[:-1])

    for up, skip in zip(up_stack, skips):
        x = up(x)
        x = tf.keras.layers.Concatenate()([x, skip])

    x = last(x)

    return tf.keras.Model(inputs=inputs, outputs=x)

# Initializing the Generator
generator = Generator()

LAMBDA = 200

def Discriminator():
    initializer = tf.random_normal_initializer(0., 0.02)

    inp = tf.keras.layers.Input(shape=[256, 256, 3], name='input_image')
    tar = tf.keras.layers.Input(shape=[256, 256, 3], name='target_image')

    x = tf.keras.layers.concatenate([inp, tar])

    down1 = downsample(64, 4, False)(x)
    down2 = downsample(128, 4)(down1)
    down3 = downsample(256, 4)(down2)

    zero_pad1 = tf.keras.layers.ZeroPadding2D()(down3)
    conv = tf.keras.layers.Conv2D(512, 4, strides=1,
                                  kernel_initializer=initializer,
                                  use_bias=False)(zero_pad1)

    batchnorm1 = tf.keras.layers.BatchNormalization()(conv)

    leaky_relu = tf.keras.layers.LeakyReLU()(batchnorm1)

    zero_pad2 = tf.keras.layers.ZeroPadding2D()(leaky_relu)

    last = tf.keras.layers.Conv2D(1, 4, strides=1,
                                  kernel_initializer=initializer)(zero_pad2)

    return tf.keras.Model(inputs=[inp, tar], outputs=last)

# Initializing the Discriminator
discriminator = Discriminator()

loss_object = tf.keras.losses.BinaryCrossentropy(from_logits=True)

# Defining the Discriminator LOSS
def discriminator_loss(disc_real_output, disc_generated_output):
    real_loss = loss_object(tf.ones_like(disc_real_output), disc_real_output)

    generated_loss = loss_object(tf.zeros_like(
        disc_generated_output), disc_generated_output)

    total_disc_loss = real_loss + generated_loss

    return total_disc_loss

# Optimizers for the models
generator_optimizer = tf.keras.optimizers.SGD(learning_rate=0.002, momentum=0.7)
discriminator_optimizer = tf.keras.optimizers.SGD(learning_rate=0.002, momentum=0.7)

# Checkpoint generation
checkpoint_dir = './training_checkpoints'
checkpoint_prefix = os.path.join(checkpoint_dir, "ckpt")
checkpoint = tf.train.Checkpoint(generator_optimizer=generator_optimizer,
                                 discriminator_optimizer=discriminator_optimizer,
                                 generator=generator,
                                 discriminator=discriminator)

checkpoint.restore(tf.train.latest_checkpoint(checkpoint_dir))

# Function for generating new images and saving them as frames
def generate_and_save_frames(model, test_input, tar, i, frame_paths):
    prediction = model(test_input, training=True)
    display_list = [test_input[0], prediction[0]]

    fig, axs = plt.subplots(1, 2, figsize=(10, 5))
    for ax, img, title in zip(axs, display_list, ['Input Image', 'Transformed Image']):
        ax.imshow(img)
        ax.set_title(title)
        ax.axis("off")

    frame_path = f'new_images/frame{i}.png'
    fig.savefig(frame_path, bbox_inches="tight")
    plt.close(fig)
    
    frame_paths.append(frame_path)

# Generate and save frames
frame_paths = []
i = 0
for inp, tar in target_dataset:
    generate_and_save_frames(generator, inp, tar, i, frame_paths)
    i += 1
    print(i)

# Convert frames to GIF
frames = [Image.open(frame) for frame in frame_paths]
frames[0].save('generated_dance.gif', format='GIF', append_images=frames[1:], save_all=True, duration=100, loop=0)

# Print model summaries
print("Generator Summary:")
generator.summary()

print("\nDiscriminator Summary:")
discriminator.summary()