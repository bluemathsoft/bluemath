
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

import {
  matmul, norm, solve, cholesky, inner, outer, svd, rank, lstsq, lu_custom,
  slogdet, det, inv, qr, triu, tril, eig
} from './ops'
import * as lapack from './lapack'

export {
  inner,
  outer,
  matmul,
  triu,
  tril,

  cholesky,

  svd,
  norm,
  solve,
  rank,
  lstsq,
  lu_custom,
  slogdet,
  det,
  inv,
  qr,
  eig,

  lapack
}
