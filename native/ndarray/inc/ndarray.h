
#pragma once

#include <cstdlib>
#include <stdint.h>
#include <stdexcept>
#include <vector>


template <class T>
class NDArray {

public:
  typedef std::vector<uint32_t> ShapeType;
  typedef std::vector<int32_t> IndexType;

private:
  uint8_t m_ndim;
  ShapeType m_shape;
  std::vector<T> m_data;

  size_t indexToOffset(const IndexType& index) {

    if(index.size() != m_shape.size()) {
      throw std::runtime_error("Mismatched number of dimensions");
    }
    size_t offset = 0;
    for(size_t i=0; i<m_shape.size(); i++) {
      if(index[i] < 0) {
        throw std::runtime_error("Not implemented yet");
      }
      if(index[i] >= m_shape[i]) {
        throw std::runtime_error("Index out of bounds");
      }
      if(i < m_shape.size()-1) {
        offset += m_shape[i+1] * index[i];
      } else {
        offset += index[i];
      }
    }
    return offset;
  }

  IndexType offsetToIndex(const uint32_t offset);

public:

  NDArray<T>(const ShapeType& shape, T *data=nullptr) {
    m_shape = shape;
    m_ndim = shape.size();
    m_data.reserve(m_ndim);
    if(data) {
      for(size_t i=0; i<m_ndim; i++) {
        m_data[i] = data[i];
      }
    }
  }

  ~NDArray<T>() {
  }

  uint32_t size() {
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

  T get(const IndexType& index) {
    return m_data[indexToOffset(index)];
  }

};


class NDArrayInt32 {
public:
  NDArrayInt32(uint32_t shape[], size_t shape_len) {}
};
