
cmake_minimum_required(VERSION 3.0.0)

project(ndarray)

set(CMAKE_C_COMPILER "/usr/bin/gcc")
file(GLOB INC_LIST
    ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/*.h
  )
file(GLOB SRC_LIST
    ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/*.c
  )

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/ndarray
  )

add_executable(${PROJECT_NAME}-test ${SRC_LIST} ${INC_LIST})
