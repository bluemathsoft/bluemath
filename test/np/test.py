import numpy as np


def test_dgelsd():
  A = np.array([[0,1],[1,1],[2,1],[3,1]],np.double)
  B = np.array([-1,0.2,0.9,2.1],np.double)
  work = np.zeros(802,np.double);
  answer = np.linalg.lapack_lite.dgelsd(
    4,2,1,A,4,B,4,np.zeros(2),-1,0,work,802,np.zeros(20,np.int32),0)

  print(answer)
  print(B)

def test_lstsq_1():
  A = np.array([[0,1],[1,1],[2,1],[3,1]],np.double)
  B = np.array([-1,0.2,0.9,2.1],np.double)
  answer = np.linalg.lstsq(A,B)
  print(answer)

def test_lstsq_2():
  A = np.array([
      [-3,1],[-0.9,1],[-1.8,1],
      [3.2,1],[1,1],[3.3,1]
    ],np.double)
  B = np.array([3.9,2.3,2,-1.4,-1,-0.1],np.double)
  answer = np.linalg.lstsq(A,B)
  print(answer)

def test_svd_4x3():
  A = np.array([
      [-3,6,-1],
      [11,-3,0],
      [0,-1,3],
      [4,4,4]
    ]);
  answer = np.linalg.svd(A,full_matrices=True,compute_uv=True)
  print(answer)

def test_eig_3x3():
  A = np.array([
    [3,6,2],
    [1,7,6],
    [9,3,2]
  ])
  answer = np.linalg.eig(A)
  print(answer)

def test_eig_2x2():
  A = np.array([
    [3,1],
    [0,2]
  ]);
  answer = np.linalg.eig(A)
  print(answer)

def test_qr():
  A = np.array([
    [3,6,2],
    [1,7,6],
    [9,3,2]
  ]);
  [q,r] = np.linalg.qr(A)
  print(q)
  print(r)

test_qr()
