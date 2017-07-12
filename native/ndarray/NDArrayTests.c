
#include <string.h>
#include "CuTest.h"

#include "ndarray.h"

void TestNDArrayConstruction(CuTest *tc) {
  ui32_t shape[] = {2,2};
  NDArray *ndarr = nda_create(f32,2,shape,NULL);
  CuAssertPtrNotNull(tc,ndarr);
  nda_destroy(ndarr);
}

CuSuite* NDArrayTestSuite() {
  CuSuite* suite = CuSuiteNew();
  SUITE_ADD_TEST(suite, TestNDArrayConstruction);
  return suite;
}
