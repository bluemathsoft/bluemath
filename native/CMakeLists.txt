
cmake_minimum_required(VERSION 3.0.0)

project(ndarray)


if(TARGET_EMCC)

  message(STATUS "Building for Emscripten")
  set(CMAKE_C_COMPILER "emcc")
  set(CMAKE_CXX_COMPILER "emcc")
  set(CMAKE_CXX_FLAGS "-std=c++11 --bind -DFOR_EMSCRIPTEN=1")

  include_directories(
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/inc
    )

  file(GLOB INC_LIST
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/inc/*.h
    )
  file(GLOB SRC_LIST
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/src/*.cpp
    )

  add_executable("ndarray.js" ${SRC_LIST})

else(TARGET_EMCC)

  message(STATUS "Building native test")
  set(CMAKE_C_COMPILER "/usr/bin/gcc")
  set(CMAKE_CXX_COMPILER "/usr/bin/g++")
  set(CMAKE_CXX_FLAGS "-std=c++11")

  set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_CURRENT_SOURCE_DIR}/cmake)
  find_package(CppUnit REQUIRED)

  include_directories(
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/inc
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/test
      ${CPPUNIT_INCLUDE_DIR}
    )
  file(GLOB INC_LIST
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/inc/*.h
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/test/*.h
    )
  file(GLOB SRC_LIST
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/src/*.cpp
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/test/*.cpp
    )
  add_executable(${PROJECT_NAME}-test ${SRC_LIST} ${INC_LIST})

  target_link_libraries(${PROJECT_NAME}-test ${CPPUNIT_LIBRARY})

endif(TARGET_EMCC)





