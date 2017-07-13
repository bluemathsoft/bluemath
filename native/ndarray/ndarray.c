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

#include <stdlib.h>
#include <string.h>
#include "ndarray.h"

uint32_t
nda_size(
  NDArray *ndarr)
{
  if(!ndarr) {
    return -1;
  }
  uint32_t size = 1;
  for(size_t i=0; i<ndarr->nd; i++) {
    size *= ndarr->shape[i];
  }
  return size;
}

NDArray *
nda_create(
  nda_datatype type,
  uint32_t nd,
  uint32_t shape[],
  void *data)
{
  NDArray *nda = (NDArray*)malloc(sizeof(NDArray));
  nda->type = type;
  nda->nd = nd;
  nda->shape = (shape_t)malloc(sizeof(uint32_t)*nd);
  memcpy(nda->shape, shape, sizeof(uint32_t)*nd);
  nda->data = data;
  return nda;
}

void
nda_destroy(
  NDArray *ndarr
)
{
  if(!ndarr) {
    return;
  }
  free(ndarr);
}

int32_t
get_int32(
  NDArray *ndarr,
  index_t index)
{

}

