
#pragma once

#include <stdint.h>
#include <vector>


template <class T>
class NDArray {

public:
  typedef std::vector<uint32_t> ShapeType;


private:
  uint8_t m_ndim;
  ShapeType m_shape;

public:

  NDArray(const ShapeType& shape);

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
