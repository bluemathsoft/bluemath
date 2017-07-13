
#include "ndarray.h"
#include "ndatest.h"

CPPUNIT_TEST_SUITE_REGISTRATION(NDATest);

void
NDATest::setUp()
{
}

void
NDATest::tearDown()
{
}

void
NDATest::testConstructor()
{
  NDArray<uint32_t>::ShapeType shape = {2,2};
  NDArray<uint32_t> ndarr(shape);
  CPPUNIT_ASSERT(ndarr.size() == 4);
}

