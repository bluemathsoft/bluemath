
#include "ndarray.h"


NDArray::NDArray(DataType type, const ShapeType &shape)
{
  m_shape = shape;
  m_ndim = shape.size();
  m_type = type;
}
