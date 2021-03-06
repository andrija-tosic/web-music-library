USE [MusicLibraryDB]
GO
SET IDENTITY_INSERT [dbo].[Releases] ON 

INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (1, N'Graduation', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (2, N'AM', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (3, N'What A Time To Be Alive', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (4, N'DONDA', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (5, N'Ako te pitaju', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (6, N'Pokaži Mi Šta Znaš', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (7, N'Pratim te', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (8, N'Sinoć Nisi Bila Tu', NULL, N'single', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (9, N'Lice Ljubavi', NULL, N'single', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (10, N'Yeezus', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (11, N'Svirajte Noćas Za Moju Dušu', NULL, N'album', NULL, NULL)
INSERT [dbo].[Releases] ([Id], [Name], [Date], [Type], [Genre], [Duration]) VALUES (12, N'Sve najbolje', NULL, N'album', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Releases] OFF
GO
SET IDENTITY_INSERT [dbo].[Tracks] ON 

INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (1, N'Good Morning', 1, 100, 4, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (2, N'Champion', 2, 120, 4, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (3, N'Stronger', 3, 180, 4, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (4, N'I Wonder', 4, 90, 2, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (5, N'Good Life', 5, 120, 3, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (6, N'Can''t Tell Me Nothing', 6, 93, 5, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (7, N'Barry Bonds', 7, 65, 3, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (8, N'Flashing Lights', 9, 76, 5, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (9, N'Everything I Am', 10, 123, 2, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (10, N'The Glory', 11, 211, 3, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (11, N'Homecoming', 12, 95, 4, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (12, N'Big Brother', 13, 99, 3, 1)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (16, N'Jumpman', 3, 95, 4, 3)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (17, N'Arabella', 1, 93, 4, 2)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (18, N'R U Mine?', 2, 123, 4, 2)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (19, N'Ako te pitaju', 1, 255, 2, 5)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (20, N'Stari Lav', 1, 238, NULL, 6)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (21, N'Lice Ljubavi', 1, 250, 3, 9)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (22, N'Pratim te', 1, 255, 5, 7)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (23, N'Sinoć Nisi Bila Tu', 1, 245, 3, 8)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (24, N'Svirajte Noćas Za Moju Dušu', 1, 200, NULL, 11)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (26, N'On Sight', 1, 156, 5, 10)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (27, N'Black Skinhead', 2, 188, 4, 10)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (30, N'Hurricane', 5, 243, 5, 4)
INSERT [dbo].[Tracks] ([Id], [Name], [TrackNumber], [Duration], [Rating], [ReleaseId]) VALUES (31, N'Cesarica', 1, 200, 5, 12)
SET IDENTITY_INSERT [dbo].[Tracks] OFF
GO
SET IDENTITY_INSERT [dbo].[Artists] ON 

INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (1, NULL, NULL, N'Kanye West')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (2, NULL, NULL, N'Arctic Monkeys')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (3, NULL, NULL, N'Drake')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (4, NULL, NULL, N'Future')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (6, NULL, NULL, N'Zdravko Čolić')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (7, NULL, NULL, N'Oliver Dragojević')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (8, NULL, NULL, N'Toše Proeski')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (9, NULL, NULL, N'Petar Grašo')
INSERT [dbo].[Artists] ([Id], [Name], [LastName], [ArtistName]) VALUES (10, NULL, NULL, N'Željko Samardžić')
SET IDENTITY_INSERT [dbo].[Artists] OFF
GO
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (1, 1)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (2, 2)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (3, 3)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (4, 3)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (1, 4)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (9, 5)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (10, 6)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (8, 7)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (6, 8)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (10, 9)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (1, 10)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (6, 11)
INSERT [dbo].[ArtistRelease] ([ArtistsId], [ReleasesId]) VALUES (7, 12)
GO
SET IDENTITY_INSERT [dbo].[MusicLibraries] ON 

INSERT [dbo].[MusicLibraries] ([Id], [Owner]) VALUES (1, N'Andrija')
INSERT [dbo].[MusicLibraries] ([Id], [Owner]) VALUES (2, N'Tošić')
SET IDENTITY_INSERT [dbo].[MusicLibraries] OFF
GO
