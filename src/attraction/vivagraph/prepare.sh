#!/bin/sh

# Copyright (C) 2023 Robin Lamberti.

# This file is part of german-mop-vote-behaviour.

# german-mop-vote-behaviour is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# german-mop-vote-behaviour is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with german-mop-vote-behaviour. If not, see <http://www.gnu.org/licenses/>.

cp ../../../attraction.json attraction.js
echo "let attraction = $(cat attraction.js)" > attraction.js

cp ../../../members.json members.js
echo "let members = $(cat members.js)" > members.js
