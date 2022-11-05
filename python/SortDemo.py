
import random
# from PyQt5.QtGui import QIcon
# from PyQt5.QtCore import pyqtSlot
# from PyQt5 import QtCore, QtGui, QtWidgets
import sys, time
import asyncio
from clock import Clock
#import clock

# import PyQt5
# from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout
from PyQt5 import QtCore, QtGui, QtWidgets, uic
from PyQt5.QtWidgets import (QApplication, QWidget, QGridLayout, QLabel, QLineEdit, QPushButton)
from PyQt5.QtGui import QPainter
        
class Sort(QWidget): # {

    def __init__(self): # {
        super().__init__()
        self.A = [int(random.random() * 300) for i in range(150)]
    # }
        
    def prepare(self): # {
        #for i in range(len(self.A)): self.A[i] = int(random.random() * 300)
        for i in range(len(self.A)):
            j = int(random.random() * len(self.A))
            self.A[i], self.A[j] = self.A[j], self.A[i]
        self._repaint()
        #asyncio.sleep(1.0)
        #time.sleep(1.0)
    # }

    def doQsort(self): # {
        self.prepare()
        self.qsort(self.A, 0, len(self.A) - 1)
    # }

    def doSelsort(self): # {
        self.prepare()
        self.selectionsort(self.A)
    # }

    def doMerge(self): # {
        self.prepare()
        self.mergesort(self.A, 0, len(self.A) - 1)
    # }
    
    def _repaint(self): # {
        self.update()
        QApplication.processEvents()
        time.sleep(0.016)
    # }

    def paintEvent(self, event): # {
        qpainter = QPainter()
        qpainter.begin(self)
        
        for i in range(len(self.A)):
            qpainter.drawLine(i * 4, 0, i * 4, self.A[i])

        qpainter.end()
    # }

    def shiftArray(self, array, start, end): # {
        for i in range(end, start - 1, -1):
            array[i+1] = array[i]
    # }

    def mergesort(self, array, left, right): # {
        if left == right: 
            return
        count = right - left + 1
        gap = int(count/2) - 1
        _left_1 = left
        _right_1 = left + gap
        _left_2 = right - gap
        _right_2 = right
        if count %2 == 0 :
            self.mergesort(array, _left_1, _right_1)
            self.mergesort(array, _left_2, _right_2)
        else:
            _left_2 -= 1
            self.mergesort(array, left, left + gap)
            self.mergesort(array, _left_2, _right_2)
        
        # merge 2 list
        
        _l = _left_1
        _r = _left_2
        for i in range(left, right + 1): # {
            if array[_l] < array[_r]:
                # array[i] = array[_l]
                _l += 1
            else:
                value = array[_r]
                _r += 1
                self.shiftArray(array, _l, _right_1)
                _l += 1
                _right_1 += 1
                array[i] = value
                self._repaint()
                
            if _l > _right_1:
                break
            if _r > _right_2:
                break
        # } 

    # }

    def selectionsort(self, array): # {
        for i in range(len(array)):
            min = i
            for j in range(i, len(array)):
                if array[j] < array[min]:
                    min = j
            if min != i:
                array[i], array[min] = array[min], array[i]
                self._repaint()
    # }

    def qsort(self, array, left, right): # {
        p = array[left]
        i = left
        j = right
        while i != j:
            while array[j] > p and i < j: 
                j -= 1
            while array[i] <= p and i < j: 
                i += 1
            if i < j: 
                array[i], array[j] = array[j], array[i]
                self._repaint()
                
        
        array[left], array[i] = array[i], array[left]
        self._repaint()
    
        if left < i-1:
            self.qsort(array, left, i-1)
        if i+1 < right:
            self.qsort(array, i + 1, right)
    # }

# }

class Panel(QWidget): # {

    def __init__(self): # {
        super().__init__()
        self.setWindowTitle('Sort')
        self.setGeometry(50, 50, 500, 500)

        layout = QGridLayout()
        self.setLayout(layout)
        
        self.mybutton1 = QPushButton('quick sort', self)
        layout.addWidget(self.mybutton1, 0, 0, 1, 1)
        self.mybutton1.clicked.connect(self.action1)

        
        self.mybutton2 = QPushButton('merge sort', self)
        layout.addWidget(self.mybutton2, 0, 1, 1, 1)
        self.mybutton2.clicked.connect(self.action2)

        self.mybutton3 = QPushButton('selection sort', self)
        layout.addWidget(self.mybutton3, 0, 2,  1, 1)
        self.mybutton3.clicked.connect(self.action3)

        self.sortPane = Sort()
        layout.addWidget(self.sortPane, 1, 0, 3, 3)

        self.timeclock = Clock()
        layout.addWidget(self.timeclock, 4, 0, 2, 2)

    # }

    def action1(self) :
        self.sortPane.doQsort()
    
    def action2(self) :
        self.sortPane.doMerge()
    
    def action3(self) :
        self.sortPane.doSelsort()
     
# }

#async def hello(): 
#    print("hello XX")

app = QtWidgets.QApplication(sys.argv)
panel = Panel()
panel.show()

#tasks = [hello() for i in range(5)]
#asyncio.run(asyncio.wait(tasks))
#print("hello done")

#a = [5,6,7,8] 
#print(a[1:2])

sys.exit(app.exec_())
