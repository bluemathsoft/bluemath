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

#include <stdint.h>

typedef enum { i8, i16, i32, f32, f64 } nda_datatype;
typedef uint32_t *shape_t;
typedef struct {
  int32_t *idx;
  uint8_t nidx;
} index_t;

typedef struct {

  nda_datatype type;

  shape_t shape;  /* Array of length nd, describing shape */

  uint32_t nd;    /* Number of dimensions */

  void *data;     /* Pointer to first element of the array */

} NDArray;


uint32_t
nda_size(
  NDArray *ndarr);

/**
 * -------------------------
 * Construction, Destruction
 */

NDArray *
nda_create(
  nda_datatype type,
  uint32_t nd,
  uint32_t shape[],
  void *data);

void
nda_destroy(
  NDArray *ndarr);


/**
 * -------------------------
 * Getters
 */

int8_t
get_int8(
  NDArray *ndarr,
  index_t index);

int16_t
get_int16(
  NDArray *ndarr,
  index_t index);

int32_t
get_int32(
  NDArray *ndarr,
  index_t index);

uint8_t
get_uint8(
  NDArray *ndarr,
  index_t index);

uint16_t
get_uint16(
  NDArray *ndarr,
  index_t index);

uint32_t
get_uint32(
  NDArray *ndarr,
  index_t index);

float
get_float(
  NDArray *ndarr,
  index_t index);

double
get_double(
  NDArray *ndarr,
  index_t index);

/**
 * -------------------------
 * Setters
 */

void
set_int8(
  NDArray *ndarr,
  index_t index,
  int8_t value);

void
set_int16(
  NDArray *ndarr,
  index_t index,
  int16_t value);

void
set_int32(
  NDArray *ndarr,
  index_t index,
  index_t value);

void
set_uint8(
  NDArray *ndarr,
  index_t index,
  uint8_t value);

void
set_uint16(
  NDArray *ndarr,
  index_t index,
  uint16_t value);

void
set_uint32(
  NDArray *ndarr,
  index_t index,
  uint32_t value);

void
set_float(
  NDArray *ndarr,
  index_t index,
  float value);

void
set_double(
  NDArray *ndarr,
  index_t index,
  double value);


