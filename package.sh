#!/bin/sh
WORKDIR=`mktemp -d XXXXXX`
VERSION=`cat manifest.json | grep version | head -n1 | cut -f4 -d'"'`
echo "Packaging github-approve-deny $VERSION"
cp github-approve-deny.png github-approve-deny.user.js manifest.json $WORKDIR
cd $WORKDIR
zip -r ../github-approve-deny-$VERSION.zip .
cd ..
rm -Rf $WORKDIR
