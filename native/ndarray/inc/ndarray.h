
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

  IndexType offsetToIndex(const uint32_t offset) {
    if(offset >= this->size()) {
      throw std::runtime_error("Index out of bounds");
    }
    uint32_t di = offset;
    IndexType idx(m_shape.size());
    for(size_t i=m_shape.size(); i>=0; i--) {
      size_t d = m_shape[i];
      idx[i] = di % d;
      di = di/d;
    }
    return idx;
  }

public:

  NDArray<T>() {
  }

  NDArray<T>(const ShapeType& shape, T *data=nullptr) {
    m_shape = shape;
    m_ndim = shape.size();
    size_t datasize = size();
    m_data.reserve(datasize);
    if(data) {
      m_data.assign(data, data+datasize);
    }
  }

  ~NDArray<T>() {
  }

  void resize(const ShapeType& shape) {
    m_shape = shape;
    m_ndim = shape.size();
    size_t newsize = size();
    m_data.reserve(newsize);
  }

  uint32_t size() {
    uint32_t s = 1;
    for(auto d : m_shape) { s *= d; }
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

  void set(const IndexType& index, T value) {
    m_data[indexToOffset(index)] = value;
  }

  void setData(T *data) {
    m_data.assign(data, data+size());
  }

};


class NDArrayInt32 {
private:
  NDArray<int32_t> m_ndarr;

public:
  NDArrayInt32(uint32_t shape[], size_t shape_len, int32_t *data=nullptr) {
    NDArray<int32_t>::ShapeType shp;
    shp.assign(shape, shape+shape_len);
    m_ndarr.resize(shp);
    if(data) {
      m_ndarr.setData(data);
    }
  }

  int32_t get(int32_t index[], size_t index_len) {
    NDArray<int32_t>::IndexType idx;
    idx.assign(index, index+index_len);
    return m_ndarr.get(idx);
  }

  void set(int32_t index[], size_t index_len, int32_t value) {
    NDArray<int32_t>::IndexType idx;
    idx.assign(index, index+index_len);
    m_ndarr.set(idx, value);
  }
};

class NDArrayFloat32 {
private:
  NDArray<float> m_ndarr;
public:
  NDArrayFloat32(uint32_t shape[], size_t shape_len, float *data=nullptr) {
    NDArray<float>::ShapeType shp;
    shp.assign(shape, shape+shape_len);
    m_ndarr.resize(shp);
    if(data) {
      m_ndarr.setData(data);
    }
  }

  float get(int32_t index[], size_t index_len) {
    NDArray<float>::IndexType idx;
    idx.assign(index, index+index_len);
    return m_ndarr.get(idx);
  }

  void set(int32_t index[], size_t index_len, float value) {
    NDArray<float>::IndexType idx;
    idx.assign(index, index+index_len);
    m_ndarr.set(idx, value);
  }
};
