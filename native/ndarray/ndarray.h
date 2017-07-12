 /*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of bluemath.

 bluemath is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 bluemath is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with bluemath. If not, see <http://www.gnu.org/licenses/>.

*/

typedef signed char i8_t;
typedef unsigned char ui8_t;
typedef signed short i16_t;
typedef unsigned short ui16_t;
typedef signed long i32_t;
typedef unsigned long ui32_t;
typedef float f32_t;
typedef double f64_t;

typedef enum { i8, i16, i32, f32, f64 } nda_datatype;

typedef struct {

  nda_datatype type;

  ui32_t *shape;  /* Array of length nd, describing shape */

  ui32_t nd;      /* Number of dimensions */

  void *data;   /* Pointer to first element of the array */

} NDArray;


ui32_t
nda_size(
  NDArray *ndarr);

/**
 * -------------------------
 * Construction, Destruction
 */

NDArray *
nda_create(
  nda_datatype type,
  ui32_t nd,
  ui32_t shape[],
  void *data);

void
nda_destroy(
  NDArray *ndarr);


/**
 * -------------------------
 * Getters
 */

i8_t
get_i8(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

i16_t
get_i16(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

i32_t
get_i32(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

ui8_t
get_ui8(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

ui16_t
get_ui16(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

ui32_t
get_ui32(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

f32_t
get_f32(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

f64_t
get_f64(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length);

/**
 * -------------------------
 * Setters
 */

void
set_i8(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  i8_t value);

void
set_i16(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  i16_t value);

void
set_i32(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  i32_t value);

void
set_ui8(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  ui8_t value);

void
set_ui16(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  ui16_t value);

void
set_ui32(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  ui32_t value);

void
set_f32(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  f32_t value);

void
set_f64(
  NDArray *ndarr,
  i32_t index[],
  ui32_t index_length,
  f64_t value);


