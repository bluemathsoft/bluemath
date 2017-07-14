
#include "ndarray.h"

#ifdef FOR_EMSCRIPTEN

#include <emscripten/bind.h>

using namespace emscripten;


EMSCRIPTEN_BINDINGS(ndarray_module) {
  class_<Dummy>("Dummy")
      .constructor<int>()
      ;
}

#endif

