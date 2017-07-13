
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
  NDArray::ShapeType shape = {2,2};
  NDArray ndarr(NDArray::i8,shape);
  CPPUNIT_ASSERT(ndarr.size() == 4);
}

