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

typedef unsigned int uint;
typedef unsigned long ulong;

typedef enum { i8, i16, i32, f32, f64 } nda_datatype;

typedef struct {

  nda_datatype type;

  uint *shape;  /* Array of length nd, describing shape */

  uint nd;      /* Number of dimensions */

  void *data;   /* Pointer to first element of the array */

} NDArray;


ulong
nda_size(
  NDArray *ndarr);

NDArray *
nda_create(
  nda_datatype type,
  uint nd,
  uint shape[],
  void *data);

void
nda_destroy(
  NDArray *ndarr);

