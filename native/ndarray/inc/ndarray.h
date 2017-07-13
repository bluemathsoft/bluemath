
#pragma once

#include <stdint.h>
#include <vector>


class NDArray {

public:
  typedef enum { i8, i16, i32, f32, f64 } DataType;
  typedef std::vector<uint32_t> ShapeType;


private:
  uint8_t m_ndim;
  DataType m_type;
  ShapeType m_shape;

public:

  NDArray(DataType type, const ShapeType& shape);

  inline uint32_t size() {
    uint32_t s = 1;
    for(auto d : m_shape) {
      s *= d;
    }
    return s;
  }

  inline const ShapeType& shape() const {
    return m_shape;
  }

  inline uint8_t ndim() const {
    return m_ndim;
  }

};
