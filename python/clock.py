
import sys
import math
import datetime
import time
import asyncio
import threading

from PyQt5 import QtCore, QtGui, QtWidgets, uic
from PyQt5.QtWidgets import QApplication, QWidget, QGraphicsScene, QGraphicsView
from PyQt5.QtGui import QPainter, QColor, QFont
from PyQt5.QtCore import Qt, QPoint, QRect, QObject, QThread, pyqtSignal


class Clock(QWidget):

    def __init__(self):
        super().__init__()
        self.start()

    def start(self):
        t = threading.Thread(target = self.threadStart)
        t.start()
        #t.join()

    def threadStart(self):
        print("start...")
        self.startFlag = True
        while(self.startFlag):
            #print("start..loop")
            #time.sleep(0.016)
            self._repaint()

    def stop(self):
        self.startFlag = False
        print("stop")
    
    def _repaint(self): # {
        self.update()
        QApplication.processEvents()
        time.sleep(0.016)
    # }

    
    def paintEvent(self, event): # {
        
        
        x = self.frameGeometry().width()/2.0
        y = self.frameGeometry().height()/2.0
        len = self.frameGeometry().height()/5.0

        current_time = datetime.datetime.now()
        #print("Hour : ", current_time.hour)
        #print("Minute : ", current_time.minute)
        #print("Second :", current_time.second)
        #print("Microsecond :", current_time.microsecond/1000000)

        h = current_time.hour
        min = current_time.minute
        s = current_time.second
        ms = current_time.microsecond/1000000

        qpainter = QPainter()

        # qpainter.drawPixmap(self.rect(), self._image)
        pen = QtGui.QPen()

        pen.setWidth(5)
        pen.setColor(QtGui.QColor('red'))
        
        

        qpainter.begin(self)


        # frame
        pen.setWidth(10)
        pen.setColor(Qt.gray)
        qpainter.setPen(pen)
        
        qpainter.drawEllipse(x - len * 2, y - len * 2, len * 4, len * 4)

        for i in range(12): #(let i = 0;i<12;i++) {
            angle = (90 - i * 360.0/12.0) * math.pi/180
            dx = 1.9 * len * math.cos(angle)
            dy = 1.9 * len * math.sin(angle)
            qpainter.drawEllipse(x + dx - 5 , y - dy - 5, 10, 10)

        # hour
        pen.setWidth(20)
        pen.setColor(Qt.blue)
        qpainter.setPen(pen)

        h = h % 12
        angle = (90 - (h + min/60.0) * 360.0/12.0) * math.pi/180
        dx = 0.8 * len * math.cos(angle)
        dy = 0.8 * len * math.sin(angle)
        qpainter.drawLine(x, y,  x + dx, y - dy)

        # minute
        pen.setWidth(12)
        pen.setColor(Qt.yellow)
        qpainter.setPen(pen)

        angle = (90 - (min + s/60.0) * 360.0/60.0) * math.pi/180
        dx = 1.5 * len * math.cos(angle)
        dy = 1.5 * len * math.sin(angle)
        qpainter.drawLine(x, y,  x + dx, y - dy)

        # SECOND
        pen.setWidth(8)
        pen.setColor(Qt.red)
        qpainter.setPen(pen)

        angle = (90 - (s + ms) * 360.0/60.0) * math.pi/180
        dx = 1.7 * len * math.cos(angle)
        dy = 1.7 * len * math.sin(angle)
        qpainter.drawLine(x, y, x + dx, y - dy)

        pen.setWidth(16)
        pen.setColor(Qt.red)
        qpainter.setPen(pen)
        qpainter.drawEllipse(x - 8, y - 8, 16, 16)

        qpainter.end()

        '''
        qpainter.setPen(QColor(0, 0, 255))
        qpainter.setFont(QFont('Arial', 20))
        qpainter.drawText(QPoint(10, 30), 'PyQt5')
        qpainter.drawText(event.rect(), Qt.AlignCenter, 'hello world')
        '''

        # qpainter.drawText(10, 30, 'PyQt5')
        # qpainter.drawText(QRect(10, 30, 100, 30), Qt.AlignLeft, 'PyQt5')
        # qpainter.drawText(10, 30, 100, 30, Qt.AlignLeft, 'PyQt5')    

    # }
        

#if __name__ == '__main__':
''' 
app = QApplication(sys.argv)
w = Clock()
w.setWindowTitle('Clock')
w.setGeometry(50, 50, 500, 500)
w.show()
sys.exit(app.exec_())
'''
