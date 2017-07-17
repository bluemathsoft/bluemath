
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

void
NDATest::testGetter()
{
  NDArray<uint32_t>::ShapeType shape = {2,2};
  std::vector<uint32_t> ndata = {4,5,6,7};
  NDArray<uint32_t> ndarr(shape, ndata.data());
  NDArray<uint32_t>::IndexType index = {0,1};

  CPPUNIT_ASSERT(ndarr.get(index) == 5);
}

void
NDATest::testSetter()
{
  NDArray<uint32_t>::ShapeType shape = {2,2};
  std::vector<uint32_t> ndata = {4,5,6,7};
  NDArray<uint32_t> ndarr(shape, ndata.data());
  NDArray<uint32_t>::IndexType index = {0,1};
  ndarr.set(index, 356);

  CPPUNIT_ASSERT(ndarr.get(index) == 356);
}
