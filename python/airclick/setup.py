from setuptools import setup

setup(
    name='airclick',
    version='0.1',
    py_modules=['simpleClick'],
    install_requires=[
        'Click'
    ],
    entry_points='''
        [console_scripts]
        simpleClick=simpleClick:cli
    '''
)