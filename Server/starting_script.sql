INSERT INTO [dbo].[MusicLibraries]
( -- Columns to insert data into
 [Owner]
)
VALUES
( -- First row: values for the columns in the list above
 'andrija'
),
( -- Second row: values for the columns in the list above
 'andrija2'
)
GO

INSERT INTO [dbo].[Artists]
( -- Columns to insert data into
 [ArtistName]
)
VALUES
( -- First row: values for the columns in the list above
 'Kanye West'
),
( -- Second row: values for the columns in the list above
 'Arctic Monkeys'
),
(
    'Drake'
),
(
    'Future'
)
-- Add more rows here
GO

INSERT INTO [dbo].[Releases]
( -- Columns to insert data into
 [Name], [Date], [Type]
)
VALUES
( -- First row: values for the columns in the list above
 'Graduation', '8-11-07', 'album'
),
( -- Second row: values for the columns in the list above
 'AM', '9-9-13', 'album'
),
(
 'What A Time To Be Alive', '9-20-2015', 'album'
)
-- Add more rows here
GO

