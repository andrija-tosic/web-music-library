﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Models;

namespace web_music_library.Migrations
{
    [DbContext(typeof(MusicLibraryContext))]
    [Migration("20220104223206_v7")]
    partial class v7
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.13")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ArtistRelease", b =>
                {
                    b.Property<int>("ArtistsId")
                        .HasColumnType("int");

                    b.Property<int>("ReleasesId")
                        .HasColumnType("int");

                    b.HasKey("ArtistsId", "ReleasesId");

                    b.HasIndex("ReleasesId");

                    b.ToTable("ArtistRelease");
                });

            modelBuilder.Entity("Models.Artist", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ArtistName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("LastName")
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<int?>("MusicLibraryId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.HasIndex("MusicLibraryId");

                    b.ToTable("Artists");
                });

            modelBuilder.Entity("Models.MusicLibrary", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Owner")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("MusicLibraries");
                });

            modelBuilder.Entity("Models.Playlist", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("Length")
                        .HasColumnType("int");

                    b.Property<int?>("MusicLibraryId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("NumberOfTracks")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MusicLibraryId");

                    b.ToTable("Playlists");
                });

            modelBuilder.Entity("Models.PlaylistTrack", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("PlaylistId")
                        .HasColumnType("int");

                    b.Property<int?>("TrackId")
                        .HasColumnType("int");

                    b.Property<int>("TrackNumber")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PlaylistId");

                    b.HasIndex("TrackId");

                    b.ToTable("PlaylistTracks");
                });

            modelBuilder.Entity("Models.Release", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("Date")
                        .HasColumnType("datetime2");

                    b.Property<int?>("Duration")
                        .HasColumnType("int");

                    b.Property<string>("Genre")
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Type")
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.HasKey("Id");

                    b.ToTable("Releases");
                });

            modelBuilder.Entity("Models.Track", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("Duration")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Rating")
                        .HasColumnType("int");

                    b.Property<int?>("ReleaseId")
                        .HasColumnType("int");

                    b.Property<int>("TrackNumber")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ReleaseId");

                    b.ToTable("Tracks");
                });

            modelBuilder.Entity("ArtistRelease", b =>
                {
                    b.HasOne("Models.Artist", null)
                        .WithMany()
                        .HasForeignKey("ArtistsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Release", null)
                        .WithMany()
                        .HasForeignKey("ReleasesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Models.Artist", b =>
                {
                    b.HasOne("Models.MusicLibrary", null)
                        .WithMany("Artists")
                        .HasForeignKey("MusicLibraryId");
                });

            modelBuilder.Entity("Models.Playlist", b =>
                {
                    b.HasOne("Models.MusicLibrary", "MusicLibrary")
                        .WithMany("Playlists")
                        .HasForeignKey("MusicLibraryId");

                    b.Navigation("MusicLibrary");
                });

            modelBuilder.Entity("Models.PlaylistTrack", b =>
                {
                    b.HasOne("Models.Playlist", "Playlist")
                        .WithMany("PlaylistTracks")
                        .HasForeignKey("PlaylistId");

                    b.HasOne("Models.Track", "Track")
                        .WithMany("PlaylistTracks")
                        .HasForeignKey("TrackId");

                    b.Navigation("Playlist");

                    b.Navigation("Track");
                });

            modelBuilder.Entity("Models.Track", b =>
                {
                    b.HasOne("Models.Release", "Release")
                        .WithMany("Tracklist")
                        .HasForeignKey("ReleaseId");

                    b.Navigation("Release");
                });

            modelBuilder.Entity("Models.MusicLibrary", b =>
                {
                    b.Navigation("Artists");

                    b.Navigation("Playlists");
                });

            modelBuilder.Entity("Models.Playlist", b =>
                {
                    b.Navigation("PlaylistTracks");
                });

            modelBuilder.Entity("Models.Release", b =>
                {
                    b.Navigation("Tracklist");
                });

            modelBuilder.Entity("Models.Track", b =>
                {
                    b.Navigation("PlaylistTracks");
                });
#pragma warning restore 612, 618
        }
    }
}