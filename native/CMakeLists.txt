
cmake_minimum_required(VERSION 3.0.0)

project(bmnative)

set(EMSDK_ROOT "$ENV{HOME}/emsdk-portable")
set(EMSDK_BIN "${EMSDK_ROOT}/emscripten/1.37.16")
set(WEBIDL_BINDER "${EMSDK_BIN}/tools/webidl_binder.py")

if(TARGET_EMCC)

  message(STATUS "Building for Emscripten")

  set(IDL ${CMAKE_CURRENT_SOURCE_DIR}/bmnative.idl)

  include(${CMAKE_CURRENT_SOURCE_DIR}/exported-functions.txt)

  set(CMAKE_C_COMPILER "emcc")
  set(CMAKE_CXX_COMPILER "emcc")
  set(CMAKE_CXX_FLAGS "-std=c++11 -O2 -DFOR_EMSCRIPTEN=1")
  set(CMAKE_EXE_LINKER_FLAGS "--memory-init-file 0 --post-js glue.js -O2 -s EXPORTED_FUNCTIONS='${EXPORTED_FUNCTIONS}'")

  include_directories(
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/inc
      ${CMAKE_CURRENT_SOURCE_DIR}/lapacklite
      ${CMAKE_BINARY_DIR}
    )

  file(GLOB INC_LIST
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/inc/*.h
      ${CMAKE_CURRENT_SOURCE_DIR}/lapacklite/*.h
    )
  file(GLOB SRC_LIST
      ${CMAKE_CURRENT_SOURCE_DIR}/ndarray/src/*.cpp
      ${CMAKE_CURRENT_SOURCE_DIR}/lapacklite/*.c
      ${CMAKE_CURRENT_SOURCE_DIR}/glue_wrapper.cpp
    )

  execute_process(
    COMMAND
    python ${WEBIDL_BINDER} ${IDL} glue
    )

  add_executable(${PROJECT_NAME}.js ${SRC_LIST})


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
