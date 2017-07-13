
#include "ndarray.h"


template <class T> NDArray<T>::NDArray(
  const NDArray::ShapeType &shape)
{
  m_shape = shape;
  m_ndim = shape.size();
}
