
#pragma once

#include "ndarray.h"
#include <cppunit/extensions/HelperMacros.h>

class NDATest : public CppUnit::TestFixture {
  CPPUNIT_TEST_SUITE(NDATest);
  CPPUNIT_TEST(testConstructor);
  CPPUNIT_TEST(testGetter);
  CPPUNIT_TEST(testSetter);
  CPPUNIT_TEST_SUITE_END();

public:
  void setUp();
  void tearDown();
  void testConstructor();
  void testGetter();
  void testSetter();
};

